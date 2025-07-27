import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for saving plots

import os

# Load the dataset
df = pd.read_csv("heart.csv")

# Create output directory
output_dir = "heart_feature_plots"
os.makedirs(output_dir, exist_ok=True)

# Separate numerical and categorical columns
numerical_cols = ['Age', 'RestingBP', 'Cholesterol', 'MaxHR', 'Oldpeak']
categorical_cols = ['Sex', 'ChestPainType', 'FastingBS', 'RestingECG', 'ExerciseAngina', 'ST_Slope']

# Plot numerical feature distributions grouped by HeartDisease
for col in numerical_cols:
    plt.figure(figsize=(8, 5))
    sns.histplot(data=df, x=col, hue='HeartDisease', kde=True, element='step', stat='density', common_norm=False)
    plt.title(f'{col} Distribution by HeartDisease')
    plt.savefig(f"{output_dir}/{col}_distribution.png")
    plt.close()

# Plot categorical feature counts grouped by HeartDisease
for col in categorical_cols:
    plt.figure(figsize=(8, 5))
    sns.countplot(data=df, x=col, hue='HeartDisease')
    plt.title(f'{col} Count by HeartDisease')
    plt.xticks(rotation=30)
    plt.tight_layout()
    plt.savefig(f"{output_dir}/{col}_count.png")
    plt.close()

print(f"✅ Saved plots to ./{output_dir}/")
