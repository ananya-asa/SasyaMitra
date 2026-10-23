#pragma once
#include <math.h>

// =========================================================================
// Auto-Generated Edge XGBoost / Gradient Boosted Ensemble for ESP32
// Rounds: 5 | Trees: 15 | Learning Rate: 0.15
// Zero dying neurons | Constant microsecond execution | Pure branch math
// =========================================================================

namespace EdgeXGBoost {

// Tree 0 (Target Class: 0)
inline float evalTree_0(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (temp < 24.94f) {
            if (temp < 17.14f) {
                return 0.110417f;
            } else {
                return 0.017214f;
            }
        } else {
            if (soilMoisture < 28.43f) {
                return -0.029167f;
            } else {
                return 0.009702f;
            }
        }
}

// Tree 1 (Target Class: 1)
inline float evalTree_1(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (solarRadiation < 525.32f) {
            if (soilMoisture < 29.46f) {
                return -0.058333f;
            } else {
                return -0.005208f;
            }
        } else {
            if (solarRadiation < 719.16f) {
                return 0.027083f;
            } else {
                return -0.023611f;
            }
        }
}

// Tree 2 (Target Class: 2)
inline float evalTree_2(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (soilMoisture < 20.92f) {
            if (temp < 21.05f) {
                return -0.027601f;
            } else {
                return 0.060135f;
            }
        } else {
            if (solarRadiation < 363.79f) {
                return 0.041667f;
            } else {
                return -0.023958f;
            }
        }
}

// Tree 3 (Target Class: 0)
inline float evalTree_3(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (temp < 24.94f) {
            if (humidity < 55.12f) {
                return -0.009846f;
            } else {
                return 0.063888f;
            }
        } else {
            if (soilMoisture < 28.43f) {
                return -0.027966f;
            } else {
                return 0.009150f;
            }
        }
}

// Tree 4 (Target Class: 1)
inline float evalTree_4(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (solarRadiation < 525.32f) {
            if (soilMoisture < 29.46f) {
                return -0.055854f;
            } else {
                return -0.004543f;
            }
        } else {
            if (solarRadiation < 719.16f) {
                return 0.026286f;
            } else {
                return -0.022688f;
            }
        }
}

// Tree 5 (Target Class: 2)
inline float evalTree_5(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (soilMoisture < 20.92f) {
            if (temp < 21.05f) {
                return -0.026267f;
            } else {
                return 0.057348f;
            }
        } else {
            if (solarRadiation < 363.79f) {
                return 0.040142f;
            } else {
                return -0.023043f;
            }
        }
}

// Tree 6 (Target Class: 0)
inline float evalTree_6(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (temp < 24.94f) {
            if (temp < 17.14f) {
                return 0.104492f;
            } else {
                return 0.014977f;
            }
        } else {
            if (soilMoisture < 28.43f) {
                return -0.026812f;
            } else {
                return 0.008631f;
            }
        }
}

// Tree 7 (Target Class: 1)
inline float evalTree_7(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (solarRadiation < 525.32f) {
            if (soilMoisture < 29.46f) {
                return -0.053515f;
            } else {
                return -0.003901f;
            }
        } else {
            if (solarRadiation < 719.16f) {
                return 0.025524f;
            } else {
                return -0.021799f;
            }
        }
}

// Tree 8 (Target Class: 2)
inline float evalTree_8(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (soilMoisture < 20.92f) {
            if (temp < 29.84f) {
                return 0.012715f;
            } else {
                return 0.078332f;
            }
        } else {
            if (solarRadiation < 363.79f) {
                return 0.038640f;
            } else {
                return -0.022151f;
            }
        }
}

// Tree 9 (Target Class: 0)
inline float evalTree_9(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (humidity < 55.12f) {
            if (humidity < 50.11f) {
                return -0.008578f;
            } else {
                return -0.071452f;
            }
        } else {
            if (temp < 20.08f) {
                return 0.093001f;
            } else {
                return 0.005403f;
            }
        }
}

// Tree 10 (Target Class: 1)
inline float evalTree_10(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (temp < 24.94f) {
            if (humidity < 82.16f) {
                return -0.020402f;
            } else {
                return -0.079973f;
            }
        } else {
            if (soilMoisture < 19.98f) {
                return -0.032892f;
            } else {
                return 0.017634f;
            }
        }
}

// Tree 11 (Target Class: 2)
inline float evalTree_11(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (soilMoisture < 20.92f) {
            if (temp < 21.05f) {
                return -0.025219f;
            } else {
                return 0.052480f;
            }
        } else {
            if (solarRadiation < 363.79f) {
                return 0.037235f;
            } else {
                return -0.021302f;
            }
        }
}

// Tree 12 (Target Class: 0)
inline float evalTree_12(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (humidity < 55.12f) {
            if (humidity < 50.11f) {
                return -0.008272f;
            } else {
                return -0.069104f;
            }
        } else {
            if (temp < 20.08f) {
                return 0.088921f;
            } else {
                return 0.005282f;
            }
        }
}

// Tree 13 (Target Class: 1)
inline float evalTree_13(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (humidity < 42.52f) {
            if (solarRadiation < 361.41f) {
                return -0.138745f;
            } else {
                return -0.019318f;
            }
        } else {
            if (humidity < 52.78f) {
                return 0.037587f;
            } else {
                return -0.017307f;
            }
        }
}

// Tree 14 (Target Class: 2)
inline float evalTree_14(float soilMoisture, float temp, float humidity, float solarRadiation) {
        if (soilMoisture < 20.92f) {
            if (temp < 29.84f) {
                return 0.010762f;
            } else {
                return 0.072435f;
            }
        } else {
            if (solarRadiation < 363.79f) {
                return 0.036087f;
            } else {
                return -0.020544f;
            }
        }
}



// Predict Crop Stress using the boosted tree ensemble
// 0 = HEALTHY, 1 = MODERATE_STRESS, 2 = HIGH_STRESS
inline int predictCropStress(float soilMoisture, float temp, float humidity, float solarRadiation) {
    float logits[3] = { 0.0f, 0.0f, 0.0f };
    const float lr = 0.15f;

    logits[0] += lr * evalTree_0(soilMoisture, temp, humidity, solarRadiation);
    logits[1] += lr * evalTree_1(soilMoisture, temp, humidity, solarRadiation);
    logits[2] += lr * evalTree_2(soilMoisture, temp, humidity, solarRadiation);
    logits[0] += lr * evalTree_3(soilMoisture, temp, humidity, solarRadiation);
    logits[1] += lr * evalTree_4(soilMoisture, temp, humidity, solarRadiation);
    logits[2] += lr * evalTree_5(soilMoisture, temp, humidity, solarRadiation);
    logits[0] += lr * evalTree_6(soilMoisture, temp, humidity, solarRadiation);
    logits[1] += lr * evalTree_7(soilMoisture, temp, humidity, solarRadiation);
    logits[2] += lr * evalTree_8(soilMoisture, temp, humidity, solarRadiation);
    logits[0] += lr * evalTree_9(soilMoisture, temp, humidity, solarRadiation);
    logits[1] += lr * evalTree_10(soilMoisture, temp, humidity, solarRadiation);
    logits[2] += lr * evalTree_11(soilMoisture, temp, humidity, solarRadiation);
    logits[0] += lr * evalTree_12(soilMoisture, temp, humidity, solarRadiation);
    logits[1] += lr * evalTree_13(soilMoisture, temp, humidity, solarRadiation);
    logits[2] += lr * evalTree_14(soilMoisture, temp, humidity, solarRadiation);

    // Argmax selection across 3 class logits
    int bestClass = 0;
    float maxLogit = logits[0];
    for (int c = 1; c < 3; c++) {
        if (logits[c] > maxLogit) {
            maxLogit = logits[c];
            bestClass = c;
        }
    }
    return bestClass;
}

} // namespace EdgeXGBoost
