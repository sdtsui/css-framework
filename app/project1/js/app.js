/**
 * Gets the container so that we can manipulate the DOM
 * @returns {Element}
 */
const getContainer = () => {
  return container = document.querySelector('body > .container:first-of-type');
};

/**
 * Adds a random id in order to be able to insert a new tag with content
 * @returns {XML|string|void}
 */
const filterID = () => {
  const newId = 'id' + JSON.stringify(Math.random());
  return newId.replace(/\.|\//g, '_');
};

/**
 * ClearDOM when routing
 */
const clearDOM = () => {
  getContainer().innerHTML = '';
};

/**
 * Removes a tag by id
 * @param id
 * @returns {Node}
 */
const removeTagById = (id) => {
  return (elem = document.getElementById(id)).parentNode.removeChild(elem);
};

/**
 * Changes routes or pages
 * @param route
 */
const route = (route = './js/page2.js') => {
  clearDOM();
  removeTagById('page');
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.setAttribute('id', 'page');
  script.src = route;
  head.appendChild(script);
};

//run each component through the getComponent function which returns a promise
// Once all the promises are resolved then mount the components
loadComponents = (components) => {
  const loadComponents = components.map(comp =>getComponent(comp));
  Promise.all(loadComponents).then(data => data.map(component => mountComponent(component)));
};

/**
 * Promise to return a component
 */
const getComponent = (file) => {
  return fetch(file).then(response => {
      return response.text().then(data => {
        return data;
      });
    }
  ).catch(err => {
    console.log('error fetching data');
  });
};

/**
 * Mounts a component to a page
 * @param data
 * @param target
 * @param idName
 */
const mountComponent = (data, target = 'DIV', idName = filterID()) => {
  // create the div where we are going to put the component
  const node = document.createElement(target);
  node.setAttribute("id", idName);
  getContainer().appendChild(node);

  document.querySelector('#' + idName).innerHTML = data;
};
