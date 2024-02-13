/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Import portions of React that are needed.
import React, { useEffect, useState } from 'react';

// Other standard imports.
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getDevtoolsProps } from '../../global/js/utils/devtools';
import { pkg /*, carbon */ } from '../../settings';

// Carbon and package components we use.
import { NavItem } from './NavItem';
import { NavList } from './NavList';
import { NavItemLink } from './NavItemLink';
// The block part of our conventional BEM class names (blockClass__E--M).
const blockClass = `${pkg.prefix}--nav`;
const componentName = 'Nav';

// NOTE: the component SCSS is not imported here: it is rolled up separately.

// Default values can be included here and then assigned to the prop params,
// e.g. prop = defaults.prop,
// This gathers default values together neatly and ensures non-primitive
// values are initialized early to avoid react making unnecessary re-renders.
// Note that default values are not required for props that are 'required',
// nor for props where the component can apply undefined values reasonably.
// Default values should be provided when the component needs to make a choice
// or assumption when a prop is not supplied.

// // Default values for props
// const defaults = {
//   activeHref:
// };

/**
 * TODO: A description of the component.
 */
export let Nav = React.forwardRef(
  (
    {
      // The component props, in alphabetical order (for consistency).
      activeHref,
      children /* TODO: remove if not needed. */,
      className,
      heading,
      label,
      ...rest
    },
    ref
  ) => {
    const [_activeHref, setActiveHref] = useState(activeHref);
    const navigationLists = [];

    useEffect(() => {
      if (!_activeHref && window.location) {
        const { hash, pathname } = window.location;
        setActiveHref(pathname + hash);
      }
    }, []);

    const handleListClick = (id) => {
      React.Children.forEach(children, (child, index) => {
        console.log('child: ', child);
        if (child.displayName === 'NavList') {
          const childId = `${blockClass}__list--${index}`;

          if (childId !== id && !child?.props?.isExpandedOnPageload) {
            navigationLists.find(({ props }) => props.id === childId).close();
          }
        }
      });
    };

    const handleItemClick = (event, activeHref, onClick) => {
      console.log('handleItemClick called passing id: ', id);

      if (onClick) {
        onClick(event);
      }
    };

    /**
     * Creates a new child list.
     * @param {NavList} child The child list to create.
     * @param {number} index The index of the child list.
     * @returns {NavList} The new child list.
     */
    const buildNewListChild = ({ props }, index) => {
      const key = `${blockClass}__list--${index}`;
      console.log('LIST CHILD!!! ');
      return (
        <NavList
          {...props}
          activeHref={activeHref}
          id={key}
          key={key}
          onListClick={handleListClick}
          onItemClick={handleItemClick}
          ref={(navigationList) => {
            navigationLists.push(navigationList);
          }}
        />
      );
    };

    /**
     * Creates a new child list item.
     * @param {NavItem} child The child list item to create.
     * @param {number} index The index of the child list item.
     * @returns {NavItem} The new child list item.
     */
    const buildNewItemChild = ({ props }, index) => {
      const key = `${blockClass}--${index}`;

      return (
        <NavItem
          {...props}
          activeHref={_activeHref}
          key={key}
          onClick={(event, href) => {
            handleItemClick(event, href, props.onClick);
          }}
        />
      );
    };

    return (
      <nav
        {
          // Pass through any other property values as HTML attributes.
          ...rest
        }
        className={cx(
          blockClass, // Apply the block class to the main HTML element
          className, // Apply any supplied class names to the main HTML element.
          // example: `${blockClass}__template-string-class-${kind}-n-${size}`,
          {
            // switched classes dependant on props or state
            // example: [`${blockClass}__here-if-small`]: size === 'sm',
          }
        )}
        ref={ref}
        role="navigation"
        aria-label={label}
        {...getDevtoolsProps(componentName)}
      >
        {heading && <h1 className={`${blockClass}__heading`}>{heading}</h1>}

        <ul className={`${blockClass}__wrapper`} role="menubar">
          {React.Children.map(children, (child, index) => {
            return child.type.displayName === 'NavList'
              ? buildNewListChild(child, index)
              : buildNewItemChild(child, index);
          })}
        </ul>
      </nav>
    );
  }
);

// Return a placeholder if not released and not enabled by feature flag
Nav = pkg.checkComponentEnabled(Nav, componentName);

// The display name of the component, used by React. Note that displayName
// is used in preference to relying on function.name.
Nav.displayName = componentName;

// The types and DocGen commentary for the component props,
// in alphabetical order (for consistency).
// See https://www.npmjs.com/package/prop-types#usage.
Nav.propTypes = {
  /** Hypertext reference for active page. */
  activeHref: PropTypes.string,
  /**
   * Provide the contents of the Nav.
   */
  children: PropTypes.node.isRequired,

  /**
   * Provide an optional class to be applied to the containing node.
   */
  className: PropTypes.string,

  /** Heading */
  heading: PropTypes.string,

  /** Aria-label on the rendered `nav` element. */
  label: PropTypes.string.isRequired,
};
