<?php
/**
 * This script makes the necessary changes to saved data files so they 
 * perfectly work with the current version of WIRIS plugin. You should run it
 * once after updating WIRIS plugin. You can safely run it more than one time.
 * This file shouln't be publicly available.
 *
 * - It updates the folder structure so it increases the filesystem access
 *   efficiency creating a file hierarchy instead of having all files in the
 *   root of formula and cache directories.
 *
 **/
 
  // WARNING: Comment the following line before using this script, and re-comment
  // it once done.
  header('HTTP/1.0 403 Forbidden'); echo '<h3>Forbidden</h3><p>If you are the server administrator, comment the first code line in update.php script.</p>'; die();
  
  // Load WIRIS plugin
  require_once 'pluginbuilder.php';
  // Set PHP environment.
  set_time_limit(0); error_reporting(E_ALL); ini_set("display_errors", 1);
  // Load the file handler object.
  $store = $pluginBuilder->getStorageAndCache();
  // Do the update.
  if (method_exists($store, 'updateFoldersStructure')) {
    $store->updateFoldersStructure();
  }
  // Finish script.
  echo '<h3>WIRIS plugin data successfully updated</h3>';
  echo '<p>Remember to uncomment the security line in update.php file to forbid the access to this script to the public.</p>';
