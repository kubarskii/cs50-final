export default class WidgetsRegistry {
  constructor(widgets) {
    this.widgets = widgets;
  }

  /**
     * Factory method for creating new WidgetsRegistry instance
     * */
  static create(widgets) {
    return new WidgetsRegistry(widgets);
  }

  getWidget(name, props) {
    if (!this.widgets[name]) return null;
    return () => this.widgets[name].component(props);
  }

  getWidgets() {
    return this.widgets;
  }
}
