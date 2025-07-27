import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import matplotlib
matplotlib.use('Agg')  # Prevent Tkinter backend errors

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import os


# Load dataset
df = pd.read_csv("resume.csv")

# Drop unnecessary columns
df = df.drop(columns=["job_ad_id", "firstname"], errors='ignore')

# Drop rows with missing values
df = df.dropna()

# Target column
target_col = "received_callback"

# Create output directory for plots
output_dir = "feature_plots"
os.makedirs(output_dir, exist_ok=True)

# Loop through features and create plots
for col in df.columns:
    if col == target_col:
        continue

    plt.figure(figsize=(8, 5))
    unique_vals = df[col].nunique()

    try:
        if df[col].dtype == 'object' or unique_vals <= 15:
            sns.countplot(data=df, x=col, hue=target_col)
            plt.title(f"Count Plot: {col} by {target_col}")
            plt.xticks(rotation=45)
        else:
            sns.boxplot(data=df, x=target_col, y=col)
            plt.title(f"Box Plot: {col} by {target_col}")
    except Exception as e:
        print(f"Could not plot {col}: {e}")
        continue

    plt.tight_layout()
    plt.savefig(f"{output_dir}/{col}_vs_callback.png")
    plt.close()

print(f"Plots saved in ./{output_dir}/")
