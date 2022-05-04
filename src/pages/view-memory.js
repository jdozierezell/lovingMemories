import React, { useState, useEffect } from 'react';


import {StateMachineProvider} from "little-state-machine";

import Layout from "../components/Layout"
import Preview from "../components/PreviewMemory"
import Seo from "../components/seo"


const PreviewMemoryPage = () => {

    useEffect(() => {



    }, []);

    return (
        <>

            <StateMachineProvider>
                <Layout>
                    <Seo title="View Memory" image="https://afsp-loving-memories.netlify.app/svg/afsp-memories-social.jpg"/>
                    <Preview/>
                </Layout>
            </StateMachineProvider>

        </>
    )
}

export default PreviewMemoryPage