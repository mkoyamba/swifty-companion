#!/bin/bash

# Démarrer le serveur Expo avec l'option --host tunnel
npx expo start --host tunnel &

# Attendre quelques secondes pour s'assurer que le serveur Expo est opérationnel
sleep 10

# Exécuter Expo sur Android
npx expo run android