#Safe Delete

##STOP USING `rm` to delete your files! Safely move your files to the trash instead using `safe-delete`.

***`rm` aka you like to live dangerously aka you just pulled a `rm -rf /*\` instead of `rm -rf ./\*`.***

***`safe-delete` aka You should have been more careful.***

***"You mean it's gone forever..."***

```
# Install Globally
sudo npm install -g safe-delete

# Move a directory to the trash
safe-delete temporaryDir

# Empty the trash with the -t or -trash flag
safe-delete -trash
Are you sure you want to permanently delete the trash? (yes/no): yes

# Aliases for safe-delete
# del = delete = safe-delete

# Use safe-delete to be verbose
# Use delete to be specific
# Use del to be short
# What good fun life can be

```