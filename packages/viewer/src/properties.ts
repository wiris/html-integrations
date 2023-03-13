// This class will handle the parameters defined by the user. Those will be used ...

// Expect mtconfig.json // configuration.ini (for the previouw viewer) // default params.

export const EDITOR_SERVICES_ROOT: string = 'https://www.wiris.net/demo/plugins/app/';    // Default value
export let lang = getBrowserLang();                                                       // Default value

/**
* Return the user's browser language.
* @returns {string} Encoded Language string.
*/
function getBrowserLang(): string {
  // TODO contemplate case in which the lang parameter is not declared in the html tag
  // e.g. also consider taking the user's settings
  return document.getElementsByTagName('html')[0].lang;
}