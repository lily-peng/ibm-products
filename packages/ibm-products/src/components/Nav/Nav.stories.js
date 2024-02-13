/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
// TODO: import action to handle events if required.
// import { action } from '@storybook/addon-actions';

import {
  getStoryTitle,
  prepareStory,
} from '../../global/js/utils/story-helper';

import { Nav } from '.';
import { NavList } from './NavList';
import { NavItem } from './NavItem';
import { NavItemLink } from './NavItemLink';
import mdx from './Nav.mdx';

import styles from './_storybook-styles.scss';

export default {
  title: getStoryTitle(Nav.displayName),
  component: Nav,
  tags: ['autodocs'],
  // TODO: Define argTypes for props not represented by standard JS types.
  // argTypes: {
  //   egProp: { control: 'color' },
  // },
  parameters: {
    layout: 'fullscreen',
    styles,
    docs: {
      page: mdx,
    },
  },
};

const mainContent = [
  <NavList title="Nav list 1">
    <NavItem key="navitem_1-1" element="span" customprop="uniqueValue">
      Nav item 1-1 (with a custom element)
    </NavItem>
    <NavItem key="navitem_1-2" onClick={console.log('onClick')}>
      Nav item 1-2
    </NavItem>
  </NavList>,
  <NavList title="Nav list 2 expanded on page load" isExpandedOnPageload>
    <NavItem key="navitem_2-1" href="#navitem_2-1">
      Nav item 2-1
    </NavItem>
    <NavItem key="navitem_2-2" href="#navitem_2-2">
      Nav item 2-2
    </NavItem>
  </NavList>,
  <NavList title="Nav list 3">
    <NavItem key="navitem_3-1" href="#navitem_3-1">
      Nav item 3-1
    </NavItem>
    <NavItem key="navitem_3-2" href="https://www.ibm.com/">
      Nav item that is an external link and wraps to a new line
    </NavItem>
  </NavList>,
];

/**
 * TODO: Declare template(s) for one or more scenarios.
 */
const Template = (args) => {
  return (
    <Nav
      // TODO: handle events with action or local handler.
      // onTodo={action('onTodo log action')}
      {...args}
    >
      {mainContent}
    </Nav>
  );
};

/**
 * TODO: Declare one or more stories, generally one per design scenario.
 * NB no need for a 'Playground' because all stories have all controls anyway.
 */
export const nav = prepareStory(Template, {
  args: {
    label: 'Label copy',
    heading: 'Heading copy',
    // TODO: Component args - https://storybook.js.org/docs/react/writing-stories/args#Nav-args
  },
});
