# MealFit Back-End

Ce dépôt est dédié au backend de l'application Koliseum Academy, une solution révolutionnaire de gestion d'entraînement conçue pour répondre à la demande croissante de cours de sports de combat individualisés ou en petits groupes, offrant une approche personnalisée similaire à celle de Doctolib.

## Commencer

Ces instructions vous fourniront une copie du projet en cours d'exécution sur votre machine locale à des fins de développement et de test. Suivez ces étapes simples pour mettre en place l'environnement de développement local.

### Prérequis

Pour exécuter ce projet, vous aurez besoin de Node.js et npm installés sur votre machine. Visitez [nodejs.org](https://nodejs.org/en/download/) pour télécharger et installer les deux.

### Installation

Après avoir cloné le code source sur votre machine avec `git clone`, suivez ces étapes pour l'installer :

1. Installez les dépendances NPM :

   ```bash
   npm install
   ```

2. Lancez le serveur de développement :

   ```bash
   npm run start
   ```

3. Si voulez deployer

```bash
   npm run build
```

## Architecture du projet

L'application Back-End MealFit suit un modèle d'architecture en couches, spécifiquement le modèle Modèle-Vue-Contrôleur (MVC) avec une couche de Service supplémentaire. Voici un bref aperçu de chaque couche :

### Model

La couche Modèle est responsable de la gestion des données et de la logique métier. Elle interagit avec la base de données et effectue des opérations telles que la création, la lecture, la mise à jour et la suppression (CRUD) des données. Dans cette application, la couche Modèle est représentée par les modèles Mongoose, comme le modèle User dans src/models/User.ts.

### Controller

La couche Contrôleur gère les requêtes HTTP entrantes et envoie des réponses. Elle utilise les services pour effectuer des opérations et renvoie les résultats au client. Les contrôleurs de cette application se trouvent dans le répertoire `controllers`, comme le UserController dans src/controllers/user.controller.ts.

### Service

La couche Service est une couche supplémentaire qui contient la logique métier. Elle est utilisée par les contrôleurs pour effectuer des opérations. Cette couche aide à garder les contrôleurs minces et le code plus maintenable. Dans cette application, les services se trouvent dans le répertoire `services`, comme le UserService dans src/services/user.service.ts.

### Routes

La couche Routes est responsable de la cartographie des requêtes HTTP entrantes vers les méthodes de contrôleur appropriées. Les routes de cette application se trouvent dans le répertoire des routes, comme les routes utilisateur dans src/routes/userRoutes.ts.

### Utilisation

Une fois que l'application est en cours d'exécution, vous pouvez accéder à l'API à l'adresse suivante par défaut :

http://localhost:3333

### Auteurs

- **Lucas Perez**
- **Hugo Raoult**
- **Damien Forafo**

Ces contributeurs ont apporté leur passion et leur expertise à l'élaboration de Koliseum Academy.
