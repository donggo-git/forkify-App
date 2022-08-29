import icons from '../../img/icons.svg'

export default class View {
  _data
  _errorMessage = "We couldn't find that recipe. Please try another one!"
  _successMessage = ''

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError
    }

    this._data = data

    this._clear();
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
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