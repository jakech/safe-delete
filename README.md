#Safe Delete

##STOP USING `rm` to delete your files! Safely move your files to the trash instead using `safe-delete`.


```
# Install Globally
sudo npm install -g safe-delete

# Move a directory to the trash
safe-delete temporaryDir

# Empty the trash with the -t or -trash flag
safe-delete -trash
Are you sure you want to permanently delete the trash? (yes/no): yes

```