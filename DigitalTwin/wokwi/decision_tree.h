// Auto-generated Classical Decision Tree for ESP32
// Zero neurons, zero matrix multiplies, pure branch inference
int predictCropStressTree(float soilMoisture, float temp, float humidity, float solarRadiation) {
    if (soilMoisture < 18.91f) {
        if (soilMoisture < 7.73f) {
            if (temp < 21.37f) {
                return 1; // MODERATE_STRESS (1)
            } else {
                return 2; // HIGH_STRESS (2)
            }
        } else {
            if (temp < 21.05f) {
                return 0; // HEALTHY (0)
            } else {
                return 2; // HIGH_STRESS (2)
            }
        }
    } else {
        if (humidity < 70.65f) {
            if (solarRadiation < 590.47f) {
                return 2; // HIGH_STRESS (2)
            } else {
                return 1; // MODERATE_STRESS (1)
            }
        } else {
            if (temp < 26.59f) {
                return 0; // HEALTHY (0)
            } else {
                return 1; // MODERATE_STRESS (1)
            }
        }
    }

}
