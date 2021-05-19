import { string } from 'prop-types';
import React, { Component } from 'react';

import { Helmet } from "react-helmet";

import { BUILD_TS, APP_VERSION, BUILD_DT } from '@app/build_info';

class Html extends React.Component<any, any> {

    get_asset_url(name: string) {
        const hosts = this.props.config['hosts']
        const host = hosts[Math.floor(Math.random() * hosts.length)];
        return `${host}${this.props.config['static_prefix']}${name}`
    }

    get_assets(type: string) {
        return this.props.assets.filter((key: string) => key.endsWith(type))
    }
    get_assets_containers(type: string) {
        const assets = this.get_assets(type);

        return assets.map((name: string, i: number) => {
            if (type == '.js') {
                return (<script src={this.get_asset_url(name)} key={i}></script>)
            }
            else if (type == '.css') {
                return (<link rel="stylesheet" href={this.get_asset_url(name)} key={i} />)
            }
        })
    }

    render() {
        return (
            <html lang="en-us">
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <style type="text/css" id="server-side-styles"></style>
                    {this.get_assets_containers('.css')}
                </head>
                <body>
                    <div id="app">
                        {this.props.children}
                    </div>
                    {this.get_assets_containers('.js')}

                </body>
            </html>
        );
    }
}


export default Html;
