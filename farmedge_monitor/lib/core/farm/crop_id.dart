enum CropId { arecanut, paddy }

extension CropIdX on CropId {
  String get zoneId => switch (this) {
        CropId.paddy => 'A',
        CropId.arecanut => 'B',
      };

  String get storageKey => name;
}
