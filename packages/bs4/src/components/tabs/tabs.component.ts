import { Component, Debug, Binding, handleizeFormatter } from '@ribajs/core';
import template from './tabs.component.html';

interface Tab {
  title: string;
  content: string;
  handle: string;
  active: boolean;
}

interface Scope {
  tabs: Tab[];
  activate: TabsComponent['activate'];
  optionTabsAutoHeight: boolean;
}

export class TabsComponent extends Component {

  public static tagName: string = 'bs4-tabs';

  protected debug = Debug('component:' + TabsComponent.tagName);
  protected scope: Scope = {
    tabs: new Array<Tab>(),
    activate: this.activate,
    optionTabsAutoHeight: false,
  };

  protected tabs?: NodeListOf<Element>;
  protected tabPanes?: NodeListOf<Element>;
  protected scrollable?: Element | null;

  static get observedAttributes() {
    return [
      'option-tabs-auto-height',
      'tab-0-title', 'tab-0-content', 'tab-0-handle',
      'tab-1-title', 'tab-1-content', 'tab-1-handle',
      'tab-2-title', 'tab-2-content', 'tab-2-handle',
      'tab-3-title', 'tab-3-content', 'tab-3-handle',
      'tab-4-title', 'tab-4-content', 'tab-4-handle',
      'tab-5-title', 'tab-5-content', 'tab-5-handle',
      'tab-6-title', 'tab-6-content', 'tab-6-handle',
      'tab-7-title', 'tab-7-content', 'tab-7-handle',
      'tab-8-title', 'tab-8-content', 'tab-8-handle',
      'tab-9-title', 'tab-9-content', 'tab-9-handle',
      'tab-10-title', 'tab-10-content', 'tab-10-handle',
      'tab-11-title', 'tab-11-content', 'tab-11-handle',
      'tab-12-title', 'tab-12-content', 'tab-12-handle',
      'tab-13-title', 'tab-13-content', 'tab-13-handle',
      'tab-14-title', 'tab-14-content', 'tab-14-handle',
      'tab-15-title', 'tab-15-content', 'tab-15-handle',
      'tab-16-title', 'tab-16-content', 'tab-16-handle',
      'tab-17-title', 'tab-17-content', 'tab-17-handle',
      'tab-18-title', 'tab-18-content', 'tab-18-handle',
      'tab-19-title', 'tab-19-content', 'tab-19-handle',
    ];
  }

  constructor(element?: HTMLElement) {
    super(element);

    this.addTabsByTemplate();
    this.initTabs();
    this.activateFirstTab();
    this.init(TabsComponent.observedAttributes);
  }

  /**
   * Make all tabs panes as height as the heighest tab pane
   */
  public setHeight() {
    if (this.scope.optionTabsAutoHeight) {
      return;
    }
    // Bind static template
    this.setElements();

    let heigest = 0;
    if (!this.tabPanes) {
      return;
    }
    this.tabPanes.forEach((tabPane) => {
      if (!(tabPane as unknown as HTMLElement).style) {
        return;
      }
      (tabPane as unknown as HTMLElement).style.height = 'auto';
      (tabPane as unknown as HTMLElement).style.display = 'block';
      const height = (tabPane as unknown as HTMLElement).offsetHeight || 0;
      if (height > heigest) {
        heigest = height;
      }
    });
    this.tabPanes.forEach((tabPane) => {
      if (!(tabPane as unknown as HTMLElement).style) {
        return;
      }
      // Reset display style property
      (tabPane as unknown as HTMLElement).style.display = '';
      if (heigest > 0) {
        (tabPane as unknown as HTMLElement).style.height = heigest + 'px';
      }
    });
  }

  public deactivateAll() {
    for (const tab of this.scope.tabs) {
      tab.active = false;
    }
  }

  public activate(tab: Tab, binding?: Binding, event?: Event) {
    this.deactivateAll();
    tab.active = true;
    this.debug('activate', event);
    if (event) {
      event.preventDefault();
    }
  }

  public activateFirstTab() {
    if (this.scope.tabs.length > 0) {
      this.activate(this.scope.tabs[0]);
    }
  }

  protected setElements() {
    this.tabs = this.el.querySelectorAll('[role="tab"]');
    this.tabPanes = this.el.querySelectorAll('[role="tabpanel"]');
    this.scrollable = this.el.querySelector('[scrollable]');
  }

  protected resizeTabsArray(newSize: number) {
    while (newSize > this.scope.tabs.length) {
      this.scope.tabs.push({handle: '', title: '', content: '', active: false});
    }
    this.scope.tabs.length = newSize;
  }

  protected onTabShownEventHandler(event: Event) {
    const curTab = (event.target || event.srcElement) as Element | null;
    if (!curTab) {
      return;
    }
    if (this.scrollable) {
      const tabScrollPosition = curTab.getBoundingClientRect();
      const scrollLeftTo = this.scrollable.scrollLeft || 0 + tabScrollPosition.left;
      // TODO animate
      // this.scrollable.animate({ scrollLeft: scrollLeftTo}, 'slow');
      this.scrollable.scrollLeft = scrollLeftTo;
    }
  }

  protected onResizeEventHandler(event: Event) {
    this.setHeight();
  }

  protected initTabs() {
    // Bind static template
    this.setElements();

    this.debug('constructor', this.el, this.tabs, this.tabPanes);

    if (this.tabs) {
      this.tabs.forEach(((tab) => {
        tab.removeEventListener('shown.bs.tab', this.onTabShownEventHandler);
        tab.addEventListener('shown.bs.tab', this.onTabShownEventHandler);
      }));
    }

    if (this.scope.optionTabsAutoHeight) {
      window.removeEventListener('resize', this.onResizeEventHandler.bind(this));
      window.addEventListener('resize', this.onResizeEventHandler.bind(this));
      this.setHeight();
    }
  }

  protected addTabByAttribute(attributeName: string, newValue: string) {
    this.debug('addTabByAttribute');
    const index = Number(attributeName.replace(/[^0-9]/g, ''));
    this.debug('index', index);
    if (index >= this.scope.tabs.length) {
      this.resizeTabsArray(index + 1);
    }
    if (attributeName.endsWith('Content')) {
      this.scope.tabs[index].content = newValue;
    }
    if (attributeName.endsWith('Title')) {
      this.scope.tabs[index].title = newValue;
      this.scope.tabs[index].handle = this.scope.tabs[index].handle || handleizeFormatter.read(this.scope.tabs[index].title);
    }
    if (attributeName.endsWith('Handle')) {
      this.scope.tabs[index].handle = newValue;
    }
    this.debug('this.scope',  this.scope);

    // if is first tab
    if (
      this.scope.tabs.length > 0 &&
      this.scope.tabs[0] &&
      this.scope.tabs[0].content.length > 0 &&
      this.scope.tabs[0].title.length > 0 &&
      this.scope.tabs[0].handle.length > 0
    ) {
      this.activateFirstTab();
    }
  }

  protected addTabsByTemplate() {
    const templates = this.el.querySelectorAll<HTMLTemplateElement>('template');
    templates.forEach((tpl) => {
      const title = tpl.getAttribute('title');
      if (!title) {
        console.error(new Error('template "title" attribute is required"'));
        return;
      }
      const handle = tpl.getAttribute('handle') || handleizeFormatter.read(title);
      if (!handle) {
        console.error(new Error('template "handle" attribute is required"'));
        return;
      }
      const content = tpl.innerHTML;
      this.scope.tabs.push({title, handle, content, active: false});
    });
  }

  protected parsedAttributeChangedCallback(attributeName: string, oldValue: any, newValue: any, namespace: string | null) {
    super.parsedAttributeChangedCallback(attributeName, oldValue, newValue, namespace);
    this.debug('parsedAttributeChangedCallback', attributeName);
    if (attributeName.startsWith('tab')) {
      this.addTabByAttribute(attributeName, newValue);
      this.initTabs();
    }
  }

  protected async afterBind(): Promise<any> {
    // Workaround
    setTimeout(() => {
      if (this.scope.optionTabsAutoHeight) {
        this.setHeight();
      }
    }, 500);
  }

  protected onlyTemplateChilds() {
    let allAreTemplates: boolean = true;
    this.el.childNodes.forEach((child) => {
      this.debug('child', child);
      allAreTemplates = allAreTemplates && (child.nodeName === 'TEMPLATE' || child.nodeName === '#text');
    });
    return allAreTemplates;
  }

  protected template() {
    // Only set the component template if there no childs or the childs are templates
    if (!this.el.hasChildNodes() || this.onlyTemplateChilds()) {
      this.debug('Use template', template);
      return template;
    } else {
      this.debug('Do not use template, because element has child nodes');
      return null;
    }
  }
}
