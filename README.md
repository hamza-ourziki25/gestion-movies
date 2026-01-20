# Movies App (React + Laravel)

Application web “Movies” avec un frontend React et une API backend Laravel.

## Fonctionnalités
- Parcourir / rechercher des films.
- Marquer un film comme “vu / à voir”.
- Gestion des listes (ex: favoris, watchlist).
- Authentification (si activée).

## Stack
- Frontend : React, HTML, CSS, JavaScript
- Backend : Laravel (PHP)
- Base de données : MySQL / SQL

## Structure du projet
> Adapte les noms si nécessaire.

- `frontend/` : application React
- `backend/` : API Laravel

## Prérequis
- Node.js + npm
- PHP + Composer
- MySQL (ou MariaDB)

## Installation (local)

### 1) Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
"# gestion-movies" 
