import '../../models/farm_status.dart';
import 'crop_id.dart';
import 'crop_rules.dart';

enum SoilMood { thirsty, happy, tooWet }

enum StormRisk { none, rainComing, stormLikely }

enum FungalBand { low, watch, high }

enum VerdictKind { storm, fungal, dry, good }

class CropSlice {
  const CropSlice({
    required this.crop,
    required this.soilMoisture,
    required this.temperature,
    required this.humidity,
    required this.pressure,
    required this.pressureTrend,
    required this.rain,
    required this.pumpOn,
    required this.soilMood,
    required this.stormRisk,
    required this.fungalBand,
    required this.verdict,
    required this.needsPumpApproval,
    required this.alert,
  });

  final CropId crop;
  final double soilMoisture;
  final double temperature;
  final double humidity;
  final double pressure;
  final double pressureTrend;
  final bool rain;
  final bool pumpOn;
  final SoilMood soilMood;
  final StormRisk stormRisk;
  final FungalBand fungalBand;
  final VerdictKind verdict;
  final bool needsPumpApproval;
  final String alert;
}

/// Derived farmer-facing state. Built only from /status + crop_rules.
class FarmerFarmState {
  const FarmerFarmState({
    required this.arecanut,
    required this.paddy,
    required this.farmVerdict,
    required this.isOnline,
    required this.isDemo,
    required this.lastUpdated,
  });

  final CropSlice arecanut;
  final CropSlice paddy;
  final VerdictKind farmVerdict;
  final bool isOnline;
  final bool isDemo;
  final DateTime? lastUpdated;

  CropSlice slice(CropId crop) =>
      crop == CropId.arecanut ? arecanut : paddy;

  static FarmerFarmState fromStatuses({
    required FarmStatus? paddyStatus,
    required FarmStatus? arecaStatus,
    required List<double> pressureHistory,
    required bool isOnline,
    required bool forceDemo,
  }) {
    final demo = forceDemo || !isOnline || paddyStatus == null;
    final paddy = _slice(
      CropId.paddy,
      paddyStatus ?? _demoStatus(CropId.paddy),
      pressureHistory,
    );
    final areca = _slice(
      CropId.arecanut,
      arecaStatus ?? paddyStatus ?? _demoStatus(CropId.arecanut),
      pressureHistory,
    );
    return FarmerFarmState(
      arecanut: areca,
      paddy: paddy,
      farmVerdict: _higherPriority(areca.verdict, paddy.verdict),
      isOnline: isOnline,
      isDemo: demo,
      lastUpdated: paddyStatus?.lastUpdated ?? arecaStatus?.lastUpdated,
    );
  }

  static CropSlice _slice(
    CropId crop,
    FarmStatus status,
    List<double> pressureHistory,
  ) {
    final rules = CropRules.forCrop(crop);
    final trend = _trend(pressureHistory, status.pressure);
    final storm = _stormRisk(status, trend, rules);
    final fungal = _fungal(status, rules);
    final soil = _soil(status.soilMoisture, rules);
    final verdict = VerdictEngine.decide(
      stormRisk: storm,
      fungalBand: fungal,
      soilMood: soil,
    );
    return CropSlice(
      crop: crop,
      soilMoisture: status.soilMoisture,
      temperature: status.temperature,
      humidity: status.humidity,
      pressure: status.pressure,
      pressureTrend: trend,
      rain: status.rain,
      pumpOn: status.pump,
      soilMood: soil,
      stormRisk: storm,
      fungalBand: fungal,
      verdict: verdict,
      needsPumpApproval: status.alert == 'NEEDS_WATER',
      alert: status.alert,
    );
  }

  static double _trend(List<double> history, double current) {
    if (history.isEmpty) return 0;
    return current - history.first;
  }

  static StormRisk _stormRisk(
    FarmStatus status,
    double trend,
    CropRules rules,
  ) {
    final forecast = status.weatherForecast.toUpperCase();
    if (forecast == 'STORM_ALERT' ||
        (trend <= rules.pressureDropStorm && status.pressure < rules.stormPressureBelow)) {
      return StormRisk.stormLikely;
    }
    if (forecast == 'RAIN_COMING' ||
        status.rain ||
        (trend <= rules.pressureDropRain && status.pressure < rules.rainPressureBelow)) {
      return StormRisk.rainComing;
    }
    return StormRisk.none;
  }

  static FungalBand _fungal(FarmStatus status, CropRules rules) {
    final inBand = status.humidity >= rules.fungalHumidityMin &&
        status.temperature >= rules.fungalTempMin &&
        status.temperature <= rules.fungalTempMax;
    if (inBand && status.humidity >= rules.fungalHumidityMin + 5) {
      return FungalBand.high;
    }
    if (inBand || status.humidity >= rules.fungalHumidityMin - 4) {
      return FungalBand.watch;
    }
    return FungalBand.low;
  }

  static SoilMood _soil(double moisture, CropRules rules) {
    if (moisture < rules.soilDryBelow) return SoilMood.thirsty;
    if (moisture > rules.soilTooWetAbove) return SoilMood.tooWet;
    return SoilMood.happy;
  }

  static VerdictKind _higherPriority(VerdictKind a, VerdictKind b) {
    int rank(VerdictKind v) => switch (v) {
          VerdictKind.storm => 0,
          VerdictKind.fungal => 1,
          VerdictKind.dry => 2,
          VerdictKind.good => 3,
        };
    return rank(a) <= rank(b) ? a : b;
  }

  static FarmStatus _demoStatus(CropId crop) {
    final rules = CropRules.forCrop(crop);
    return FarmStatus(
      temperature: 27,
      humidity: 70,
      soilMoisture: (rules.soilHappyLow + rules.soilHappyHigh) / 2,
      battery: 80,
      pump: false,
      rain: false,
      cropStress: CropStress.low,
      pressure: 1013,
      weatherForecast: 'STABLE',
      weatherSource: 'DEMO',
      batteryHoursRemaining: 20,
      currentDraw: 80,
      lastUpdated: DateTime.now(),
      apiTemperature: 27,
      apiHumidity: 70,
      apiRain: false,
      smartTriggerMode: 'CONFIRMATION',
      alert: 'NONE',
    );
  }
}

class VerdictEngine {
  const VerdictEngine._();

  static VerdictKind decide({
    required StormRisk stormRisk,
    required FungalBand fungalBand,
    required SoilMood soilMood,
  }) {
    if (stormRisk == StormRisk.stormLikely) return VerdictKind.storm;
    if (fungalBand == FungalBand.high) return VerdictKind.fungal;
    if (soilMood == SoilMood.thirsty) return VerdictKind.dry;
    return VerdictKind.good;
  }
}
