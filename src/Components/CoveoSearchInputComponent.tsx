import {
    buildStandaloneSearchBox,
    StandaloneSearchBoxOptions,
    StandaloneSearchBox,
  } from '@coveo/headless';
  import { useEffect, useState, FunctionComponent, useContext } from 'react';
  import EngineContext from '../common/engineContext';
  
  export const CoveoStandaloneSearchBoxRenderer: FunctionComponent<{
    controller: StandaloneSearchBox;
  }> = ({ controller }) => {
    const [state, setState] = useState(controller.state);
  
    useEffect(
      () => controller.subscribe(() => setState(controller.state)),
      []
    );
    function isEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
      return e.key === 'Enter';
    }
  
    if (!state) {
      return null;
    }
  
    if (state.redirectTo) {
      const { redirectTo, value, analytics } = state;
      const data = JSON.stringify({ value, analytics });
      localStorage.setItem('coveo_standalone_search_box_data', data);
      window.location.href = redirectTo;
      return null;
    }
  
    return (
      <div style={{ display: 'flex', flexDirection : "column", justifyContent: 'center', alignItems: 'center' }}>
        <h2>Coveo Standalone Search Box</h2>
        <input
          style={{ width: '300px', height : "20px" }} // Adjust width as needed
          value={state.value}
          onChange={(e) => {
            controller.updateText(e.target.value);
          }}
          onKeyDown={(e) => isEnterKey(e) && controller.submit()}
        />
        <ul>
          {state.suggestions.map((suggestion) => {
            const value = suggestion.rawValue;
            return (
              <li key={value} onClick={() => controller.selectSuggestion(value)}>
                {value}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  
  const CoveoStandaloneSearchBox = (props: StandaloneSearchBoxOptions) => {
    const engine = useContext(EngineContext)!;
    const controller = buildStandaloneSearchBox(engine!, { options: props });
  
    return <CoveoStandaloneSearchBoxRenderer controller={controller} />;
  };
  
  export default CoveoStandaloneSearchBox;
  