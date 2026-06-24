import pandas as pd
import json

try:
    dfs = pd.read_html(r"C:\Users\fulto\.gemini\antigravity-ide\brain\3a121877-a99b-411f-8a76-778c82f7a547\.system_generated\steps\14\content.md")
    for i, df in enumerate(dfs):
        print(f"Table {i} shape: {df.shape}")
        if df.shape[0] > 10 and df.shape[1] > 2:
            print(df.head())
except Exception as e:
    print(f"Error reading HTML: {e}")
