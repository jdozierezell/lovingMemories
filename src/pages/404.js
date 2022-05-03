import React, {useEffect, useState} from 'react';

import Layout from "../components/Layout"
import Seo from "../components/seo"
import {navigate} from "gatsby";
import Header from "../components/Header/headerWithNav";
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from "antd";

const NotFoundPage = () => (
    <Layout>
        <Seo title="404: Not found"/>

            <div className="px-10 pt-30 lg:px-20 lg:pt-20 text-center flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="block text-gray-900 pt-5">
                        You seem to have fallen of the regular path
                    </h1>
                    <p className="text-lg max-w-xl block mx-auto text-gray-900 pb-8">
                        Don't worry, click the button below and you will be back on track.
                    </p>
                    <button onClick={() => navigate("/")}
                            className="btn-solid mx-auto flex flex-wrap items-center justify-between px-8 py-3 mt-4 text-sm leading-none bg-blue-500 text-white border border-blue-500 rounded-full hover:border-blue-900 hover:bg-blue-900 hover:text-white hover:bg-afsp-blue-dark lg:mt-0">
                        Continue
                    </button>
                </div>
            </div>


    </Layout>
)

export default () => {
    const [isMount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, [])

    if (!isMount) {

        return (
            <></>
        )
    }

    return (
        NotFoundPage()
    )


}
