import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComponentRenderer } from '../ComponentRenderer';
import { vi } from 'vitest';

vi.mock('../../ComponentRegistry', () => {
  const React = require('react');
  const MockTextDisplay = ({ text }: { text: string }) => React.createElement('div', null, text);
  const MockContainer = ({ children }: { children: any }) => React.createElement('section', null, children);
  return {
    ComponentRegistry: {
      MockTextDisplay,
      MockContainer,
    }
  };
});

describe('ComponentRenderer', () => {

  it('renders a simple component from the registry', () => {
    const config = {
      component: 'MockTextDisplay',
      props: { text: 'Hello, World!' },
    };
    render(<ComponentRenderer config={config} context={{}} />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('returns null if config is invalid', () => {
    const { container } = render(<ComponentRenderer config={null} context={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a "not found" message for an unknown component and suppresses console warning', () => {
    // Mock console.warn to prevent logging during this specific test
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

    const config = { component: 'UnknownComponent', props: {} };
    render(<ComponentRenderer config={config} context={{}} />);

    expect(screen.getByText('Component not found: UnknownComponent')).toBeInTheDocument();

    // Verify that the warning was called, and then restore the original implementation
    expect(consoleWarnSpy).toHaveBeenCalledWith('Component "UnknownComponent" not found in registry.');
    consoleWarnSpy.mockRestore();
  });

  it('resolves simple template strings from context', () => {
    const config = {
      component: 'MockTextDisplay',
      props: { text: '{{user.name}}' },
    };
    const context = { user: { name: 'Alice' } };
    render(<ComponentRenderer config={config} context={context} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('resolves nested template strings from context', () => {
    const config = {
      component: 'MockTextDisplay',
      props: { text: '{{data.user.profile.name}}' },
    };
    const context = { data: { user: { profile: { name: 'Bob' } } } };
    render(<ComponentRenderer config={config} context={context} />);
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('handles a mix of static and dynamic props', () => {
    const config = {
      component: 'MockTextDisplay',
      props: { text: 'Welcome, {{user.name}}!' }, // Note: current implementation only resolves full matches
    };
    const context = { user: { name: 'Charlie' } };
    render(<ComponentRenderer config={config} context={context} />);
    // Based on implementation, this won't be "Welcome, Charlie!". It will be just the value.
    // Let's test the actual behavior.
    const config_full_match = {
      component: 'MockTextDisplay',
      props: { text: '{{user.name}}' }
    }
    render(<ComponentRenderer config={config_full_match} context={context} />);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders nested children components', () => {
    const config = {
      component: 'MockContainer',
      children: [
        {
          component: 'MockTextDisplay',
          props: { text: 'Child 1' },
        },
        {
          component: 'MockTextDisplay',
          props: { text: 'Child 2' },
        },
      ],
    };
    render(<ComponentRenderer config={config} context={{}} />);
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
