/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Import portions of React that are needed.
import React, { useEffect, useState, useRef } from 'react';

// Other standard imports.
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getDevtoolsProps } from '../../global/js/utils/devtools';
import { pkg /*, carbon */ } from '../../settings';

// Carbon and package components we use.
import { Launch } from '@carbon/react/icons';
import uuidv4 from '../../global/js/utils/uuidv4';
import { NavItemLink } from './NavItemLink';
// The block part of our conventional BEM class names (blockClass__E--M).
export const blockClass = `${pkg.prefix}--nav-item`;
const componentName = 'NavItem';
// Default values for props
const defaults = {
  activeHref: '#',
  current: null,
  disabled: false,
  element: 'a',
  label: '',
  link: true,
  onClick: () => {},
  tabIndex: 0,
};
/**
 * Navigation item component.
 */
export let NavItem = React.forwardRef(
  (
    {
      // The component props, in alphabetical order (for consistency).
      activeHref = defaults.activeHref,
      children /* TODO: remove if not needed. */,
      className,
      current = defaults.current,
      disabled = defaults.disabled,
      element = defaults.element,
      handleItemSelect,
      href,
      id,
      label = defaults.label,
      link = defaults.link,
      onClick = defaults.onClick,
      tabIndex = defaults.tabIndex,
      /* TODO: add other props for Nav, with default values if needed */

      // Collect any other property values passed in.
      ...rest
    },
    ref
  ) => {
    const [isCurrentNavItem, setIsCurrentNavItem] = useState(false);

    const internalId = useRef(uuidv4());
    const instanceId = `${blockClass}__${internalId.current}`;
    const isAbsoluteLink = new RegExp('^([a-z]+://|//)', 'i');

    const externalLink =
      isAbsoluteLink.test(href) && href.indexOf(window.location.host) === -1;
    const navItemId = id || instanceId;
    const linkClassName = `${blockClass}__link`;

    const handleDisabled = (action, defaultValue = null) =>
      !disabled ? action : defaultValue;
    const navItemTabIndex = handleDisabled(tabIndex, -1);
    const externalLinkProps = externalLink && {
      rel: 'noopener noreferrer',
      target: '_blank',
    };

    useEffect(() => {
      setIsCurrentNavItem(
        current === navItemId || (activeHref === href && !externalLink)
      );
    }, [current, navItemId, activeHref, href, externalLink]);

    return (
      <li
        label={label}
        className={cx(blockClass, className, {
          [`${blockClass}--active`]: isCurrentNavItem,
          [`${blockClass}--disabled`]: disabled,
        })}
        ref={ref}
        {...getDevtoolsProps(componentName)}
      >
        {link ? (
          <NavItemLink
            id={navItemId}
            className={cx(linkClassName, {
              [`${blockClass}__link--external`]: externalLink,
            })}
            element={element}
            href={href}
            tabIndex={navItemTabIndex}
            onClick={(event) => handleDisabled(onClick(event, href))}
            onKeyDown={(event) => handleDisabled(onClick(event, href))}
            {...rest}
            {...externalLinkProps}
          >
            {children}
            {externalLink && (
              <Launch
                className={`${blockClass}__link--external__icon`}
                size={16}
              />
            )}
          </NavItemLink>
        ) : (
          <div
            id={navItemId}
            className={linkClassName}
            onClick={handleDisabled(handleItemSelect)}
            onKeyDown={handleDisabled(handleItemSelect)}
            role="menuitem"
            tabIndex={navItemTabIndex}
          >
            {children}
          </div>
        )}
      </li>
    );
  }
);

// The display name of the component, used by React. Note that displayName
// is used in preference to relying on function.name.
NavItem.displayName = componentName;

// The types and DocGen commentary for the component props,
// in alphabetical order (for consistency).
// See https://www.npmjs.com/package/prop-types#usage.
NavItem.propTypes = {
  /**
   * Hypertext reference for active page.
   */
  activeHref: PropTypes.string,
  /**
   * Provide the contents of the Nav.
   */
  children: PropTypes.node.isRequired,
  /**
   * Provide an optional class to be applied to the containing node.
   */
  className: PropTypes.string,
  /**
   * Currently selected item.
   */
  current: PropTypes.string,
  /**
   * Whether the item is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * The base element to use to build the link. Defaults to `a`, can also accept alternative tag names or custom components like `Link` from `react-router`.
   */
  element: PropTypes.elementType,

  /**
   * Click handler of an item.
   */
  handleItemSelect: PropTypes.func,

  /**
   * The href of the nav item.
   */
  href: PropTypes.string,

  /**
   * Identifier.
   */
  id: PropTypes.string,

  /**
   * Label of an item.
   */
  label: PropTypes.string,

  /**
   * Whether the item is a link.
   */
  link: PropTypes.bool,

  /**
   * Click handler of an item.
   */
  onClick: PropTypes.func,

  /**
   * `tabindex` of an item.
   */
  tabIndex: PropTypes.number,
};
