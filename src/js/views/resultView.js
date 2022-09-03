import previewView from './previewView'
import View from './View'
import previewView from './previewView'

class resultView extends View {
  _parentElement = document.querySelector('.results')

  _generateMarkup() {
    return this._data.map(result => this._generateMarkupPreview(result)).join('')
  }
  _generateMarkupPreview() {
    return this._data.map(result => previewView.render(result, false)).join('')
  }
}

export default new resultView()