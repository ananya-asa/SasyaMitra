// Auto-generated Multi-Task Neural Network Weights for ESP32
// Inputs: [Temp_norm, Hum_norm, Moisture_norm, Solar_norm]
// Hidden Layer: 5 Neurons (ReLU)
// Outputs: Classification (3 classes: HEALTHY, MODERATE_STRESS, HIGH_STRESS) 
//          & Regression (Water Requirement Score, 0-100)

namespace EdgeML {
    // Hidden Layer 1 Weights (Input to Hidden)
    const float W1[4][5] = {
        {-0.024216f, -0.227972f, -0.085052f, -0.075006f, 0.050425f},
        {-0.123480f, 0.152237f, -0.028931f, 0.141426f, -0.121687f},
        {-0.151676f, 1.205586f, -0.063011f, 0.606176f, 1.158024f},
        {-0.080332f, 0.023629f, -0.057026f, -0.005686f, -0.068233f},
    };
    
    const float b1[5] = { 0.000000f, -0.121731f, 0.000000f, -0.102155f, -0.088488f };

    // Classification Branch Weights (Hidden to Class Output)
    const float W_class[5][3] = {
        {-0.042265f, -0.095104f, 0.013848f},
        {0.311727f, 0.095098f, -0.090794f},
        {0.231098f, 0.028360f, 0.080377f},
        {0.177267f, -0.094328f, -0.279947f},
        {-0.137005f, 0.114366f, 0.153010f},
    };
    
    const float b_class[3] = { -0.059113f, -0.067668f, 0.126781f };

    // Regression Branch Weights (Hidden to Reg Output)
    const float W_reg[5][1] = {
        {0.080030f},
        {-1.166061f},
        {0.092691f},
        {-0.597953f},
        {-1.156926f},
    };
    
    const float b_reg[1] = { 1.072293f };

    // Forward Propagation logic executing at the Edge
    struct Prediction {
        int crop_health; // 0 = HEALTHY, 1 = MODERATE_STRESS, 2 = HIGH_STRESS
        float water_requirement_score; // 0.0 to 100.0
    };

    Prediction predict(float temp, float hum, float soilMoisture, float solarRadiation) {
        // 1. Normalize Inputs
        float x[4];
        x[0] = (temp - 15.0f) / 25.0f;
        x[1] = (hum - 30.0f) / 65.0f;
        x[2] = (soilMoisture - 5.0f) / 40.0f;
        x[3] = (solarRadiation - 200.0f) / 800.0f;

        // 2. Feed Hidden Layer (Matrix multiply + Bias + ReLU activation)
        float h[5];
        for (int j = 0; j < 5; j++) {
            float sum = b1[j];
            for (int i = 0; i < 4; i++) {
                sum += x[i] * W1[i][j];
            }
            h[j] = (sum > 0.0f) ? sum : 0.0f; // ReLU
        }

        // 3. Classification Outputs (Logits + Softmax prediction)
        float c_logits[3];
        for (int j = 0; j < 3; j++) {
            float sum = b_class[j];
            for (int i = 0; i < 5; i++) {
                sum += h[i] * W_class[i][j];
            }
            c_logits[j] = sum;
        }
        // Find argmax for classification
        int best_class = 0;
        float max_logit = c_logits[0];
        for (int j = 1; j < 3; j++) {
            if (c_logits[j] > max_logit) {
                max_logit = c_logits[j];
                best_class = j;
            }
        }

        // 4. Regression Output (Logit + Sigmoid activation)
        float r_logit = b_reg[0];
        for (int i = 0; i < 5; i++) {
            r_logit += h[i] * W_reg[i][0];
        }
        // Sigmoid mapping: 1 / (1 + exp(-x))
        float sigmoid_val = 1.0f / (1.0f + expf(-r_logit));
        float water_score = sigmoid_val * 100.0f;

        Prediction result;
        result.crop_health = best_class;
        result.water_requirement_score = water_score;
        return result;
    }
}
