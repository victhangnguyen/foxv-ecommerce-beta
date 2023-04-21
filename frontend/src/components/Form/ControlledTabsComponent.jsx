import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';

function ControlledTabsComponent({ tabItems, triggerSelectChange }) {
  const [key, setKey] = React.useState(tabItems[0].eventKey);
  const renderTabItems = tabItems.map((tabItem) => {
    return (
      <Tab
        key={tabItem.eventKey}
        eventKey={tabItem.eventKey}
        title={tabItem.title}
      >
        {tabItem.element}
      </Tab>
    );
  });

  return (
    <Tabs
      id="controlled-tab"
      activeKey={key}
      onSelect={(k) => {
        setKey(k);
        triggerSelectChange(k);
      }}
      className="mb-3"
    >
      {renderTabItems}
    </Tabs>
  );
}

export default ControlledTabsComponent;
