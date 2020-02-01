import React from 'react';

class TabHelper extends React.Component {
  tabs: NodeListOf<Element>;
  tabsContent: NodeListOf<Element>;

  constructor() {
    super({});
    this.tabs = document.querySelectorAll('.tabs li');
    this.tabsContent = document.querySelectorAll('.tab-content');
  }

  initialize = () => {
    this.tabs.forEach((tab: Element) => {
      tab.addEventListener('click', () => {
        this.deactivateAllTabs();
        this.hideTabsContent();
        tab.classList.add('is-active');
        this.activateTabsContent(tab);
      });
    })
  }

  deactivateAllTabs = () => {
    this.tabs.forEach((tab) => {
      tab.classList.remove('is-active');
    });
  }

  hideTabsContent = () => {
    this.tabsContent.forEach((tabContent) => {
      tabContent.classList.remove('is-active');
    });
  }

  activateTabsContent = (tab: Element) => {
    const tabsContent = document.querySelectorAll('.tab-content');
    tabsContent[this.getIndex(tab)].classList.add('is-active');
  };

  getIndex = (tab: Element) => {
    const nodes = Array.prototype.slice.call(tab?.parentElement?.children);
    return nodes.indexOf(tab);
  };
}

export default TabHelper;
