import * as React from "react";
import { Typography, Button } from "@material-ui/core";
import { ISession } from "../../../logic/domains/sessionDetails.domain";
import EditableTable from "../../presentational/EditableTable";
import { createNewSessions } from "../../../logic/functions/createNewSessions";
import { createSessionContainerStyle } from "./styles";

interface CreateSessionsContainerProps {}

// Column headings in the table used in this component
const CreateSessionsContainer: React.FunctionComponent<CreateSessionsContainerProps> = () => {
	const classes = createSessionContainerStyle();
	const [state, setState] = React.useState({
		columns: [
			{ title: "Date", field: "date" },
			{ title: "Start Time", field: "startTime" },
			{ title: "End Time", field: "endTime" },
			{ title: "Room", field: "room" },
			// { title: 'A/NA', field: '' },
			{ title: "Type", field: "type" }
		],
		data: [{} as ISession]
	});

	const isEmpty = (str: string): boolean => {
		return !str || 0 === str.length;
	};

	const validateSessions = (): boolean => {
		console.log(state.data);
		for (let session of state.data) {
			if (
				isEmpty(session.date) ||
				(isEmpty(session.startTime) ||
					isEmpty(session.endTime) ||
					isEmpty(session.room) ||
					isEmpty(session.type))
			) {
				return false;
			}
		}
		return true;
	};

	const submitNewSessions = async () => {
		if (validateSessions()) {
			const tempData = state.data as Array<ISession>;
			for (let index in state.data) {
				tempData[index] = { ...tempData[index], advisor: "current advisor" };
				// TODO: delete tableData key and value
			}
			try {
				await createNewSessions(tempData);
				alert("Sessions created");
			} catch (err) {
				alert("An error occurred when creating the sessions");
			}
		} else {
			alert("Please fill in all fields for your new sessions");
		}
	};

	return (
		<div className={classes.lockup}>
			<Typography variant="body1">
				To add sessions, please enter their details below and click "Add". If you do not
				wish to add a session that you have selected a date & time for, please click "Clear"
				next to that session before adding.
			</Typography>
			<Typography variant="body1">
				Please note: all the fields are compulsory, otherwise that session will not be
				added.
			</Typography>
			<EditableTable
				state={state}
				setState={setState}
				options={{ paging: false }}
				tableTitle={"Create Sessions"}
			/>
			<Button id="submitBooking" color="primary" size="large" onClick={submitNewSessions}>
				Book Session
			</Button>
		</div>
	);
};

export default CreateSessionsContainer;
