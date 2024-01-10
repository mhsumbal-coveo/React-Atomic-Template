import {
    StandaloneSearchBoxOptions,
    buildSearchBox,
    SearchBox
  } from '@coveo/headless';
  import { useEffect, useState, FunctionComponent, useContext } from 'react';
  import EngineContext from '../common/engineContext';
  
  export const CoveoStandaloneSearchBoxRenderer: FunctionComponent<{
    controller: SearchBox;
  }> = ({ controller }) => {
    const [state, setState] = useState(controller.state);
  
    useEffect(
      () => controller.subscribe(() => setState(controller.state)),
      []
    );
    function isEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
      return e.key === 'Enter';
    }

  
    return (
      <div style={{ display: 'flex', flexDirection : "column", justifyContent: 'center', alignItems: 'center' }}>
        <h2>Coveo Search Box</h2>
        <input
          style={{ width: '300px', height : "20px" }} // Adjust width as needed
          value={state.value}
          onChange={(e) => {
            controller.updateText(e.target.value);
          }}
          onKeyDown={(e) => {
            if(isEnterKey(e) ){
              controller.submit();
              window.location.href = `/search#${state.value && `q=${state.value}`}`
            }
          }}
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
    const controller = buildSearchBox(engine!);
  
    return <CoveoStandaloneSearchBoxRenderer controller={controller} />;
  };
  
  export default CoveoStandaloneSearchBox;
  