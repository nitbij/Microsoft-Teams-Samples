// <copyright file="dashboard.jsx" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// </copyright>

import React, { Component } from "react";
import { Text, Flex, FlexItem, Button, Divider } from "@fluentui/react-northstar";
import { CallVideoIcon } from '@fluentui/react-icons-northstar'
import * as microsoftTeams from "@microsoft/teams-js";
import DashboardState from "../models/dashboard-state";
import axios from "axios";
import moment from 'moment';
/*import moment from 'moment'*/
import "../style/style.css";
import { Link } from 'react-router-dom'

// Dashboard
class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            teamMeetingEvent: [],
            meetingList: [],
            teamsContext: {}
        }
    }

    /**
    * Component Initilization.
    */
    componentDidMount() {
        microsoftTeams.app.initialize().then(() => {
            microsoftTeams.app.getContext().then((context) => {
                this.setState({ teamsContext: context });
                this.initializeData(context.user.id);
            })
        });
    }

    /**
    * Initialize list of meetings.
    * @param {any} teamId Id of user.
    */
    initializeData = async (teamId) => {
        var response = await axios.get(`api/eventlist/${teamId}`);
        if (response.status === 200) {
            console.log("testing", response.data.value);
            this.setState({ teamMeetingEvent: response.data });
            return response.data;
        }
        { this.renderBasedOnMeetingList() }
    }

    // when user click on create new meeting button.
    onCreateMeeting = () => {
        microsoftTeams.dialog.open({
            title: "Create Meeting/Events",
            url: `${window.location.origin}/fileupload`,
            size: {
                height: 450,
                width: 700,
            }
        }, (dialogResponse) => {
            if (dialogResponse.result) {
                this.setState({
                    dashboardState: DashboardState.Default,
                });
            }
        });
    }

    // Renders the MeetingList.
    renderBasedOnMeetingList = () => {
        if (this.state.teamMeetingEvent) {
            console.log("list", this.state.teamMeetingEvent)
            return (<Flex column>
                <Text size="large" className="headColor" content="Meetings List" style={{ marginTop: "1rem" }} weight="bold" />
                <Divider color="brand" />
                {this.renderMeetingList()}
            </Flex>)
        }
    }

    // Whne Clicks on Join Url
    meetingUrl = (url) => {
        console.log("----->", url.checked);
        window.open(url, '_blank');
    }

    // Renders list of meeeting available for current user.
    renderMeetingList = () => {
        var elements = [];

        this.state.teamMeetingEvent.map((item, index) => {
            elements.push(<Flex className="tag-container" vAlign="center">
                <Flex.Item size="size.small">
                    <Flex gap="gap.large">                        
                        <Text content={`Subject : ${item.topicName}`} weight="semibold" />  
                        {<Text content={`Organizer: ${JSON.stringify(item.organizer.emailAddress.name)}`} weight="semibold" />}
                    </Flex>
                </Flex.Item>
                <Flex gap="gap.large">
                  {/*  <Link to='/'>{item.meetinglink}Meeting Link</Link>*/}
                   {/* <Button icon={item.weblink} to={item.meetinglink} variant="raised" color="primary" text primary content="Meeting Link" />*/}
                   {/* <Button icon={<item.weblink>} text primary content="Meeting Link" />*/}
                    <Button icon={<CallVideoIcon />} to={item.meetinglink} text primary content="Meeting Link" />
                   
                    <Text content={`Created On :  ${moment(item.createdDateTime).format('MMMM Do YYYY')}`} weight="semibold" />
                    <Text content="" />
                </Flex>
                <Flex.Item size="size.quarter">
                    <Flex gap="gap.large">
                        <Text content={moment(item.createdDateTime).fromNow()} />
                    </Flex>
                </Flex.Item>
            </Flex>);
        });

        return elements;
    }

    render() {
        return (<Flex className="container" column >
            <Flex vAlign="center"   >
                <Text content="Create Meeting/Events" size="larger" weight="semibold" />
                <FlexItem push>
                    <Button primary content="Import training plans" onClick={this.onCreateFileUploadClick} />
                </FlexItem>
            </Flex>
            <Flex>
                {this.renderBasedOnMeetingList()}
            </Flex>
        </Flex>)
    }

    // Handler when user click on click file upload button.
    onCreateFileUploadClick = () => {
        microsoftTeams.dialog.open({
            title: "Upload File",
            url: `${window.location.origin}/fileupload`,
            size: {
                height: 550,
                width: 700,
            }
        }, (dialogResponse) => {
            if (dialogResponse.result) {
                this.setState({
                    dashboardState: DashboardState.Default,
                    selectedEventMeeting: {}                  
                });
                 
                this.initializeData(this.state.teamsContext.team.app.userId);
                
            }
            
        });
    }

}
export default Dashboard;