import React, { useContext, useEffect } from "react";
import { SearchEngine, loadQueryActions } from "@coveo/headless";
import EngineContext from "../common/engineContext";
import {
  AtomicLayoutSection,
  AtomicSearchLayout,
  AtomicResultList,
  AtomicResultSectionTitle,
  AtomicResultLink,
  AtomicSearchBox,
  AtomicFacet,
  AtomicQuerySummary
} from "@coveo/atomic-react";
import CoveoStandaloneSearchBox from "./CoveoSearchInputComponent";

interface ISearchPageProps {
  engine: SearchEngine;
}

const SearchPageRenderer: React.FunctionComponent<ISearchPageProps> = (
  props
) => {
  return (
    <>
        <CoveoStandaloneSearchBox redirectionUrl="/search"/>
    <AtomicSearchLayout>
      <AtomicLayoutSection section={"search"}>
        <AtomicSearchBox />
      </AtomicLayoutSection>
      <AtomicLayoutSection section={"facets"}>
        <AtomicFacet field="concepts" label="Concepts"></AtomicFacet>
        <AtomicFacet field="source" label="Source" />
      </AtomicLayoutSection>
      <AtomicLayoutSection section={"main"}>
      <AtomicLayoutSection section={"status"} >
        <AtomicQuerySummary />
        </AtomicLayoutSection>
        <AtomicResultList template={() => <MyDefaultTemplate />} />
      </AtomicLayoutSection>
    </AtomicSearchLayout>
    </>
  );
};

const MyDefaultTemplate: React.FC<{}> = () => {
  return (
    <>
      <AtomicResultSectionTitle>
        <AtomicResultLink />
      </AtomicResultSectionTitle>
    </>
  );
};

const SearchPage = () => {
  const engine = useContext(EngineContext)!;
  useEffect(() => {
    const { updateQuery } = loadQueryActions(engine);
    const data = localStorage.getItem("coveo_standalone_search_box_data");
    if (data) {
      localStorage.removeItem("coveo_standalone_search_box_data");
      const { value, analytics } = JSON.parse(data);
      engine.dispatch(updateQuery({ q: value }));
      console.log({ value });
      engine.executeFirstSearchAfterStandaloneSearchBoxRedirect(analytics);
    } else {
      engine.executeFirstSearch();
    }
  }, []);

  return <SearchPageRenderer engine={engine} />;
};

export default SearchPage;
