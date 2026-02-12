/**
 * Machine Learning Tutorial - Lesson content for each lesson slug
 */
export const generateMLLessonContent = (lessonSlug: string) => {
  const mlLessons: Record<string, { title: string; content: string; tryItCode: string }> = {
    home: {
      title: 'Machine Learning Tutorial',
      content: `
# Welcome to Machine Learning Tutorial

**Machine Learning (ML)** is a subset of AI where systems **learn from data** instead of being explicitly programmed.

## What You'll Learn

- What ML is and types (supervised, unsupervised, reinforcement)
- **Regression** – predicting continuous values
- **Classification** – predicting categories
- **Clustering** – grouping without labels
- **Decision trees** – interpretable models

## Typical Stack

- **Python** – most common language for ML
- **NumPy** – numerical computing
- **pandas** – data manipulation
- **scikit-learn** – classic ML algorithms
- **TensorFlow / PyTorch** – deep learning (advanced)

## Prerequisites

Basic **Python** and **math** (algebra, statistics) help. We'll use simple examples to build intuition.
      `,
      tryItCode: `# Python + scikit-learn (run in your environment)
# pip install scikit-learn

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
print("Train size:", len(X_train), "Test size:", len(X_test))`,
    },
    'what-is-ml': {
      title: 'What is ML?',
      content: `
# What is Machine Learning?

**Definition:** ML is when a system **improves its performance** on a task through **experience** (data), without being explicitly programmed for every case.

## Traditional Programming vs ML

- **Traditional:** Rules + Data → Answers (e.g. "if price > 100 then flag")
- **ML:** Data + Answers (labels) → Model → New data → Predictions

## Key Ideas

- **Training** – feed the algorithm data (and often labels)
- **Model** – the learned function (e.g. weights in a linear model)
- **Inference** – use the model to predict on new data
- **Generalization** – perform well on unseen data, not just training data

## Why ML?

- Patterns too complex to hand-code (e.g. image recognition, speech)
- Data is abundant; rules are hard to write
- Adapts when data changes
      `,
      tryItCode: `# Simple "learning": fit a line to points
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])  # y = 2*x

model = LinearRegression().fit(X, y)
print("Prediction for 6:", model.predict([[6]]))  # ~12`,
    },
    types: {
      title: 'Types of ML',
      content: `
# Types of Machine Learning

## 1. Supervised Learning

- **Labeled data** – each example has a known output
- **Goal:** Learn a function that maps inputs to outputs
- **Regression** – output is continuous (e.g. price, temperature)
- **Classification** – output is a category (e.g. spam/not spam, digit 0–9)

## 2. Unsupervised Learning

- **No labels** – only inputs
- **Goal:** Find structure (clusters, dimensions, anomalies)
- **Clustering** – group similar examples (e.g. customer segments)
- **Dimensionality reduction** – compress data (e.g. PCA)

## 3. Reinforcement Learning

- **Agent** takes **actions** in an **environment**, gets **rewards**
- **Goal:** Learn a policy that maximizes long-term reward
- Used in games, robotics, recommendation systems
      `,
      tryItCode: `# Supervised: classification
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier

X, y = load_iris(return_X_y=True)
clf = RandomForestClassifier().fit(X, y)
print("Predict class:", clf.predict(X[:1]))  # e.g. [0]`,
    },
    regression: {
      title: 'Linear Regression',
      content: `
# Linear Regression

**Regression** predicts a **continuous** value. **Linear regression** assumes a linear relationship: \`y ≈ w₀ + w₁x₁ + …\`

## Simple Example

One input \`x\`, one output \`y\`: fit a line \`y = w₀ + w₁x\`.

## In scikit-learn

<pre><code class="python">
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
</code></pre>

## Metrics

- **MSE** (Mean Squared Error) – average of (true - pred)²
- **R²** – how much variance is explained (0 to 1)
- **MAE** – mean absolute error

## Assumptions

- Linear relationship; errors roughly normal; less sensitive to outliers if you use robust methods.
      `,
      tryItCode: `from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])

model = LinearRegression().fit(X, y)
pred = model.predict(X)
print("R2:", r2_score(y, pred))
print("Coefficients:", model.coef_, model.intercept_)`,
    },
    classification: {
      title: 'Classification',
      content: `
# Classification

**Classification** predicts a **category** (class): e.g. spam/not spam, digit 0–9, disease yes/no.

## Binary vs Multiclass

- **Binary:** two classes (e.g. 0/1, yes/no)
- **Multiclass:** more than two (e.g. iris species, digits)

## Common Algorithms

- **Logistic Regression** – linear model for probability
- **k-Nearest Neighbors (k-NN)** – vote by nearby points
- **Decision Trees** – split by feature thresholds
- **Random Forest** – ensemble of trees
- **SVM** – max-margin classifier

## In scikit-learn

<pre><code class="python">
from sklearn.ensemble import RandomForestClassifier
clf = RandomForestClassifier()
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
accuracy = (y_pred == y_test).mean()
</code></pre>
      `,
      tryItCode: `from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
clf = RandomForestClassifier().fit(X_train, y_train)
acc = (clf.predict(X_test) == y_test).mean()
print("Accuracy:", acc)`,
    },
    clustering: {
      title: 'Clustering',
      content: `
# Clustering

**Clustering** is **unsupervised**: no labels. The goal is to group similar examples together.

## K-Means

- Choose **K** (number of clusters)
- Initialize K centroids
- Repeat: assign each point to nearest centroid; update centroids as mean of assigned points
- Stop when assignments (or centroids) barely change

## In scikit-learn

<pre><code class="python">
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)
labels = kmeans.predict(X)
centroids = kmeans.cluster_centers_
</code></pre>

## Other Methods

- **Hierarchical** – build a tree of merges/splits
- **DBSCAN** – density-based; can find arbitrary shapes and mark noise
      `,
      tryItCode: `from sklearn.datasets import load_iris
from sklearn.cluster import KMeans

X, y = load_iris(return_X_y=True)
kmeans = KMeans(n_clusters=3, random_state=42).fit(X)
print("Cluster labels (first 10):", kmeans.labels_[:10])
print("Centroids shape:", kmeans.cluster_centers_.shape)`,
    },
    'decision-trees': {
      title: 'Decision Trees',
      content: `
# Decision Trees

A **decision tree** is a model that splits data by asking yes/no questions on features (e.g. "x₁ ≤ 5?"). It's **interpretable** and forms the basis of Random Forest and XGBoost.

## How It Works

- **Root** – first split (e.g. best feature + threshold by information gain or Gini)
- **Branches** – follow feature conditions
- **Leaves** – predicted class (or value for regression)

## Pros and Cons

- **Pros:** Easy to read, no scaling needed, handles non-linearity
- **Cons:** Can **overfit** (deep trees); use **max_depth**, **min_samples_leaf**, or **pruning**

## In scikit-learn

<pre><code class="python">
from sklearn.tree import DecisionTreeClassifier
tree = DecisionTreeClassifier(max_depth=5)
tree.fit(X_train, y_train)
# Optional: visualize with plot_tree(tree, feature_names=...)
</code></pre>
      `,
      tryItCode: `from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)
tree = DecisionTreeClassifier(max_depth=3, random_state=42).fit(X, y)
print("Feature importances:", tree.feature_importances_)
print("Predict:", tree.predict(X[:3]))`,
    },
  };

  return (
    mlLessons[lessonSlug] || {
      title: 'ML Lesson',
      content: '# Coming Soon\n\nThis lesson is being prepared.',
      tryItCode: '# Python + scikit-learn',
    }
  );
};
