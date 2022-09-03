import icons from '../../img/icons.svg'

export default class View {
  _data
  _errorMessage = "We couldn't find that recipe. Please try another one!"
  _successMessage = ''

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data


    const markup = this._generateMarkup();
    if (!render) return markup

    console.log(markup)
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
    //////
  }

  update(data) {
    /*if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError()
    }
*/
    this._data = data
    const newMarkup = this._generateMarkup()

    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElement = Array.from(newDOM.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'))

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];

      //update change TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent

      //update change ATTRIBUTE

      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes)
          .forEach(attr => curEl.setAttribute(attr.name, attr.value))


    })
  }


  _clear() {
    this._parentElement.innerHTML = ''
  }

  renderSpinner = function () {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `
    //this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)


  }

  renderError = function (message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage = function (message = this._successMessage) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

}