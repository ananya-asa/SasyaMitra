import 'crop_id.dart';

/// Crop thresholds for coastal Karnataka Arecanut and Paddy.
///
/// PLACEHOLDER: verify with ICAR / CPCRI / state agri university.
/// These numbers are demo ranges, not agronomy facts.
class CropRules {
  const CropRules({
    required this.crop,
    required this.soilDryBelow,
    required this.soilHappyLow,
    required this.soilHappyHigh,
    required this.soilTooWetAbove,
    required this.fungalHumidityMin,
    required this.fungalTempMin,
    required this.fungalTempMax,
    required this.stormPressureBelow,
    required this.rainPressureBelow,
    required this.pressureDropStorm,
    required this.pressureDropRain,
  });

  final CropId crop;

  /// PLACEHOLDER: verify with ICAR/CPCRI/state agri university.
  final double soilDryBelow;
  final double soilHappyLow;
  final double soilHappyHigh;
  final double soilTooWetAbove;
  final double fungalHumidityMin;
  final double fungalTempMin;
  final double fungalTempMax;
  final double stormPressureBelow;
  final double rainPressureBelow;
  final double pressureDropStorm;
  final double pressureDropRain;

  /// PLACEHOLDER: verify with ICAR/CPCRI/state agri university.
  static const arecanut = CropRules(
    crop: CropId.arecanut,
    soilDryBelow: 35,
    soilHappyLow: 40,
    soilHappyHigh: 65,
    soilTooWetAbove: 78,
    fungalHumidityMin: 82,
    fungalTempMin: 22,
    fungalTempMax: 32,
    stormPressureBelow: 995,
    rainPressureBelow: 1008,
    pressureDropStorm: -2.5,
    pressureDropRain: -0.8,
  );

  /// PLACEHOLDER: verify with ICAR/CPCRI/state agri university.
  static const paddy = CropRules(
    crop: CropId.paddy,
    soilDryBelow: 45,
    soilHappyLow: 55,
    soilHappyHigh: 85,
    soilTooWetAbove: 95,
    fungalHumidityMin: 85,
    fungalTempMin: 24,
    fungalTempMax: 34,
    stormPressureBelow: 995,
    rainPressureBelow: 1008,
    pressureDropStorm: -2.5,
    pressureDropRain: -0.8,
  );

  static CropRules forCrop(CropId crop) {
    return switch (crop) {
      CropId.arecanut => arecanut,
      CropId.paddy => paddy,
    };
  }
}
