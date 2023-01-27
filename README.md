# Get started

1. Cloner le repo 2 fois avec la commande suivante

```bash
git clone git@github.com:soymustamahti/ci-scripting.git
mv ci-scripting ci-scripting-push
git clone git@github.com:soymustamahti/ci-scripting.git
```

2. Le premier repo (`ci-scripting-push`) c'est pour faire des push sur la branche `dev` et vaoir si la CI reagit

3. Le deuxieme repo (`ci-scripting`) c'est pour lancé la CI qui va verifier les evenments sur la branche dev

4. Aller dans le doiseme repo (`ci-scripting`) et changer de branche vers `ci-v2`

```bash
    git checkout ci-v2
```

5. Installer les dépendances

```bash
    npm install
```

6. Lancer le script

```bash
    npm run dev
```

7. Aller dans le premier repo (`ci-scripting-push`) et changer de branche vers `dev`

```bash
    git checkout dev
```

 ### Important, avant de faire des changements dans le premier repo (`ci-scripting-push`) vous devez attendre une minute que la dosiem repo (`ci-scripting`) dans la console fasse la première vérification du dernier commit dans la branche `dev` afin qu'il puisse le comparer. 

8. Faire un changement dans le fichier dans le fichier `index.ts`, fair un add, un commit et push

```bash
    git add .
    git commit -m "Message pour tester la CI"
    git push
```

9. Dans la terminal du deuxieme repo (`ci-scripting`) on va voir les logs de la CI, et vous allez voir que la CI a bien reagit au push. Vous pouvez aussi aller sur le ficher `ci/logger/info.log` pour voir les logs de la CI.

10. Vous pouvez aussi aller egalment sur le ficher `ci/logger/error.log` pour voir les logs d'erreur de la CI. Notamment quand le test echoue.

11. Si le test est correct, la ci va faire un rebase sur la branche `main` de la branche `dev` et va pusher les changements sur la branche `main`.

12. Si le test echoue, la ci va faire revert les changements sur la branche `dev` pour revenir a l'etat avant le que les tests echoue.

13. Pour voire le code source de la CI, aller dans le dossier `ci`