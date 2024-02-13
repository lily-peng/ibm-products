/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Import portions of React that are needed.
import React, { useState, useEffect } from 'react';
import { ChevronDown } from '@carbon/react/icons';
// Other standard imports.
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getDevtoolsProps } from '../../global/js/utils/devtools';
import { pkg /*, carbon */ } from '../../settings';
import { set } from 'lodash';

// Carbon and package components we use.
import { NavItem } from './NavItem';
// The block part of our conventional BEM class names (blockClass__E--M).
const blockClass = `${pkg.prefix}--nav__list`;
const navItemBlockClass = `${pkg.prefix}--nav-item`;
const componentName = 'NavList';

// NOTE: the component SCSS is not imported here: it is rolled up separately.

// Default values can be included here and then assigned to the prop params,
// e.g. prop = defaults.prop,
// This gathers default values together neatly and ensures non-primitive
// values are initialized early to avoid react making unnecessary re-renders.
// Note that default values are not required for props that are 'required',
// nor for props where the component can apply undefined values reasonably.
// Default values should be provided when the component needs to make a choice
// or assumption when a prop is not supplied.

// Default values for props
const defaults = {
  activeHref: '#',
  isExpandedOnPageload: false,
  onItemClick: () => {},
  onListClick: () => {},
  tabIndex: 0,
};

/**
 * TODO: A description of the component.
 */
export let NavList = React.forwardRef(
  (
    {
      // The component props, in alphabetical order (for consistency).
      activeHref = defaults.activeHref,
      children /* TODO: remove if not needed. */,
      className,

      icon,
      id,
      isExpandedOnPageLoad = defaults.isExpandedOnPageload,
      navigationItemTitle,
      onItemClick = defaults.onItemClick,
      onListClick = defaults.onListClick,
      tabIndex = defaults.tabIndex,
      title,
      /* TODO: add other props for Nav, with default values if needed */

      // Collect any other property values passed in.
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(isExpandedOnPageLoad);
    useEffect(() => {
      const allLinks = React.Children.toArray(children)
        .filter(
          ({ props: childProps }) =>
            childProps.href && childProps.href.length > 0
        )
        .map(({ props: childProps }) => childProps.href);

      setIsOpen(allLinks.includes(activeHref));
    }, [activeHref]);

    return (
      <li
        {...rest}
        className={cx(blockClass, className, {
          [`${blockClass}--expanded`]: isOpen,
        })}
        ref={ref}
        tabIndex={tabIndex}
        onClick={(e) => {
          if (!isOpen) {
            onListClick(id);
          }
          setIsOpen((prev) => !prev);
        }} //this.toggle
        //onKeyPress={this.toggle} //DEPRECATED
        role="menuitem"
        {...getDevtoolsProps(componentName)}
      >
        <div className={`${navItemBlockClass}__link`}>
          {icon && (
            <img
              alt={navigationItemTitle}
              className={`${navItemBlockClass}__img`}
              src={icon}
            />
          )}
          <div className={`${navItemBlockClass}__content`}>{title}</div>
          <ChevronDown className={`${blockClass}__icon`} size={16} />
        </div>
        <ul
          aria-label={title}
          aria-hidden={!open}
          className={`${blockClass} ${blockClass}--nested`}
          role="menu"
        >
          {React.Children.map(children, (child, index) => {
            return (
              <NavItem
                {...child.props}
                key={`${navItemBlockClass}--${index}`}
                onClick={(event, href) => {
                  onItemClick(event, href);

                  if (onClick) {
                    onClick(event);
                  }
                }}
                activeHref={activeHref}
                tabIndex={isOpen ? 0 : -1}
              />
            );
          })}
        </ul>
      </li>
    );
  }
);

// The display name of the component, used by React. Note that displayName
// is used in preference to relying on function.name.
NavList.displayName = componentName;

// The types and DocGen commentary for the component props,
// in alphabetical order (for consistency).
// See https://www.npmjs.com/package/prop-types#usage.
NavList.propTypes = {
  /** Hypertext reference for active page. */
  activeHref: PropTypes.string,

  /** Child elements. */
  children: PropTypes.node,

  /** Extra classes to add. */
  className: PropTypes.string,

  /** Icon of a list. */
  icon: PropTypes.string,

  /** ID of a list. */
  id: PropTypes.string,

  /** State of a list. */
  isExpandedOnPageLoad: PropTypes.bool,

  /** Title of nav. */
  navigationItemTitle: PropTypes.string,

  /** Click handler for an item. */
  onItemClick: PropTypes.func,

  /** Click handler for a list. */
  onListClick: PropTypes.func,

  /** `tabindex` of an item. */
  tabIndex: PropTypes.number,

  /** Label of the list. */
  title: PropTypes.string,
};
