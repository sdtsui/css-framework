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
const route = (route) => {
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
  console.log('loading', components);
  const loadComponents = components.map(comp => getComponent(comp.name, comp.id));
  Promise.all(loadComponents).then(data => data.map(component => mountComponent(component.data, component.id)));
};

/**
 * Promise to return a component
 */
const getComponent = (file, id) => {
  return fetch(file).then(response => {
      return response.text().then(data => {
        return { data, id };
      });
    }
  ).catch(err => {
    console.log('error fetching data');
  });
};

/**
 * Appends HTML to a container
 */
const appendToContainer = (idName, data, target) => {
  idName = filterID();
  const node = document.createElement(target);
  node.setAttribute("id", idName);
  getContainer().appendChild(node);
  document.querySelector('#' + idName).innerHTML = data;
};

/**
 * Appends HTML to an element with a specific id
 * If the id exists then it appends to it.
 * If it does not exist then it creates a new one and
 * appends to the container
 */
const appendToId = (idName, data, target) => {
  const nodeExists = document.querySelector('#' + idName);
  if (nodeExists) {
    const node = document.createElement(target);
    node.innerHTML = data;
    nodeExists.appendChild(node);
  } else {
    const node = document.createElement(target);
    node.setAttribute("id", idName);
    getContainer().appendChild(node);
    document.querySelector('#' + idName).innerHTML = data;
  }
};

/**
 * Mounts a component to a page
 * @param data
 * @param target
 * @param idName
 */
const mountComponent = (data, idName, target = 'DIV') => {
  // check if the id already exists

  // only runs if you do not specify an id. It appends to the
  // container by default
  if (!idName) {
    appendToContainer(idName, data, target);
    return;
  }

  // Appends item to the specific element that has the specific id
  appendToId(idName, data, target);
};

const submitForm = () => {

  fetch('http://localhost:3010/compile', {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'Application/json'
    }),
    body: JSON.stringify({
      $background: document.querySelector('#background').value,
    })
  });
};