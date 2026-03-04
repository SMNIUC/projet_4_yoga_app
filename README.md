Couverture de test backend
<img width="1437" height="248" alt="Screenshot 2026-03-04 at 08 56 39" src="https://github.com/user-attachments/assets/f6e00fad-f6ee-4abc-9ce5-b9a3fb71ccb2" />

Couverture de test frontend
<img width="999" height="546" alt="Screenshot 2026-02-27 at 19 02 40" src="https://github.com/user-attachments/assets/b0467f9e-7975-495c-b811-d80c9d77e3c5" />
# Yoga App

Application complète de gestion de sessions de yoga avec un backend Spring Boot et un frontend Angular.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

### Pour le Backend
- **Java Development Kit (JDK) 21** - [Télécharger](https://www.oracle.com/java/technologies/downloads/#java21)
- **Maven 3.9.3 ou plus** - [Télécharger](https://archive.apache.org/dist/maven/maven-3/3.9.3/binaries/)
- **Docker Desktop** - [Télécharger](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** (généralement inclus avec Docker Desktop)

### Pour le Frontend
- **Node.js** (version 18 ou plus) et **npm** - [Télécharger](https://nodejs.org/)

## 🗂️ Structure du projet

```
projet_4_yoga_app/
├── yoga-app-backend/     # Backend Spring Boot avec base de données MySQL
└── yoga-app-frontend/    # Frontend Angular
```

## 🚀 Installation et Démarrage

### 1. Démarrage du Backend

#### Étape 1 : Préparer l'environnement

1. Lancez **Docker Desktop** sur votre poste de travail
2. Ouvrez un terminal et allez à la racine du backend :

```bash
cd yoga-app-backend
```

#### Étape 2 : Lancer le backend

Utilisez Maven pour démarrer l'application :

```bash
mvn clean spring-boot:run
```

Cette commande va :
- Télécharger les dépendances nécessaires
- Construire le projet
- Créer et démarrer automatiquement un conteneur Docker MySQL
- Lancer l'application Spring Boot et la connecter à la base de données

Une fois démarré, le backend sera accessible sur `http://localhost:8080`

Vous verrez des logs similaires à ceux-ci :

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.5.5)

[main] c.o.s.SpringBootSecurityJwtApplication : Started SpringBootSecurityJwtApplication in X.XXX seconds
```

### 2. Démarrage du Frontend

#### Étape 1 : Installer les dépendances

Dans un **nouveau terminal**, allez au dossier du frontend :

```bash
cd yoga-app-frontend
```

Installez les dépendances Node/npm :

```bash
npm install
```

#### Étape 2 : Lancer le frontend

```bash
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

## ✅ Exécution des Tests

### Tests Backend

#### Tests Unitaires

Depuis le dossier `yoga-app-backend`, exécutez :

```bash
mvn test
```

Cette commande exécute les tests unitaires du projet et génère un rapport de couverture de code (JaCoCo).

#### Voir le rapport de couverture

Après l'exécution des tests, le rapport est généré à :

```
yoga-app-backend/target/site/jacoco/index.html
```

Ouvrez ce fichier dans un navigateur pour voir les détails de la couverture de code.

### Tests Frontend

Depuis le dossier `yoga-app-frontend` :

#### Tests Unitaires (Jest)

```bash
npm test
```

Pour exécuter les tests en mode watch (à chaque modification) :

```bash
npm run test:watch
```

#### Couvrir les tests

Pour générer un rapport de couverture :

```bash
npm test -- --coverage
```

Le rapport sera disponible dans `coverage/lcov-report/index.html`

#### Tests E2E (Cypress)

Pour ouvrir l'interface Cypress :

```bash
npm run cypress:open
```

Pour exécuter tous les tests E2E en mode headless :

```bash
npm run cypress:run
```

Pour générer le rapport de couverture E2E :

```bash
npm run e2e:coverage
```

Le rapport sera disponible dans `coverage/lcov-report/index.html`

## 🔗 Communication entre Frontend et Backend

Le frontend communique avec le backend via les APIs REST sur `http://localhost:8080`.

Un fichier `proxy.conf.json` est configuré pour faciliter le développement local.

## 🛑 Arrêt de l'Application

Pour arrêter les services :

1. **Backend** : Appuyez sur `Ctrl+C` dans le terminal du backend
2. **Frontend** : Appuyez sur `Ctrl+C` dans le terminal du frontend
3. **Docker** : Docker Desktop arrêtera automatiquement les conteneurs, ou vous pouvez les arrêter manuellement via l'interface Docker Desktop

## 📝 Commandes Utiles

### Backend (Maven)

| Commande | Description |
|----------|-------------|
| `mvn clean` | Nettoie les fichiers générés |
| `mvn compile` | Compile le projet |
| `mvn test` | Exécute les tests unitaires |
| `mvn spring-boot:run` | Lance l'application |
| `mvn package` | Crée un fichier JAR |
| `mvn clean spring-boot:run` | Nettoie et lance (recommandé au premier démarrage) |

### Frontend (npm)

| Commande | Description |
|----------|-------------|
| `npm install` | Installe les dépendances |
| `npm start` | Lance l'application en développement |
| `npm test` | Exécute les tests unitaires |
| `npm run test:watch` | Exécute les tests en mode watch |
| `npm run e2e` | Exécute les tests E2E |
| `npm run cypress:open` | Ouvre l'interface Cypress |
| `npm run lint` | Vérifie la qualité du code |

## 🐛 Dépannage

### Le backend ne démarre pas

- Vérifiez que Docker Desktop est lancé
- Vérifiez que vous avez Java 21 installé : `java -version`
- Vérifiez que Maven est bien en version 3.9.3 ou plus : `mvn -version`
- Supprimez le dossier `.m2/repository` et relancez

### Le frontend ne se connecte pas au backend

- Vérifiez que le backend fonctionne sur `http://localhost:8080`
- Vérifiez que le proxy `proxy.conf.json` est correctement configuré
- Vérifiez les logs du navigateur (F12 → Console)

### Erreur de port déjà utilisé

Si le port 8080 (backend) ou 4200 (frontend) est déjà utilisé :

**Backend** : Le changer dans `application.properties`
**Frontend** : Spécifier un autre port avec `ng serve --port 4201`

## 📚 Documentation

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [Maven Documentation](https://maven.apache.org/guides/)

---

**Version** : 0.0.1  
**Backend** : Spring Boot 3.5.5 avec Java 21  
**Frontend** : Angular 19.2.15
