import * as React from 'react';
import { Typography, FormControl, FormGroup, Button } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import TextLockup from '../../presentational/TextLockup';
import { Session, NeedsHelpWithOptions } from '../../../logic/domains/sessionDetails.domain';
import bookSession from '../../../logic/functions/bookSession'; 
import HelpOption from '../../presentational/AdminDashboard/HelpOption';
import SessionBookingField from '../../presentational/AdminDashboard/SessionBookingField';

type BookSessionContainerProps = RouteComponentProps<any> & {}

type CheckBoxField = {
    id: string;
    label: string;
}

const BookSessionContainer:React.FunctionComponent<BookSessionContainerProps> = (props) => {
    console.log(props.location.state);

    React.useEffect(() => {
        
    }, []);
    
    let needsHelpWithInitialState: Array<NeedsHelpWithOptions> = [
        { id: "bookingAnswer1", value: false },
        { id: "bookingAnswer2", value: false },
        { id: "bookingAnswer3", value: false },
        { id: "bookingAnswer4", value: false },
        { id: "bookingAnswer5", value: false },
        { id: "bookingAnswer6", value: false },
        { id: "bookingAnswer7", value: false },
    ]

    // TODO: Setting these to '' and false is a problem. Need to determine whether we set these values when we create a session (either from front or backend)
    let initialState: Session = {...props.location.state.eventData };
    
    let { reason, subjectName, assignmentType, isGroupAssignment, needsHelpWithOptions } = initialState;
    needsHelpWithOptions = needsHelpWithOptions.length > 0 ? needsHelpWithOptions : needsHelpWithInitialState;

    initialState = {
        ...initialState, 
        reason: reason || '', 
        subjectName: subjectName || '', 
        assignmentType: assignmentType || '', 
        isGroupAssignment: isGroupAssignment || false, 
        needsHelpWithOptions, 
    };

    const [sessionData, setSessionData] = React.useState<Session>(initialState);
    const [additionalChecks, setAdditionalChecks] = React.useState({
        emailStudent: false,
        emailAdmin: false,
        checkRule: false
    });

    const handleChange = (key: string) => (event: any) => {
        setSessionData({
            ...sessionData,
            [key]: event.target.value
        });
    }

    const handleCheckboxChange = (id: string) => (event: any) => {
        const data: Session = sessionData;
        for (let index in data.needsHelpWithOptions) {
            if (data.needsHelpWithOptions[index].id === id) {
                data.needsHelpWithOptions[index].value = event.target.checked;
                break;
            }
        }
        setSessionData(data);
        console.log(sessionData);
    }

    const handleEmailCheckboxChange = (key: string) => (event: any) => {
        console.log('updating ', key);
        setAdditionalChecks({
            ...additionalChecks, 
            [key]: event.target.checked
        });
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        console.log(sessionData);
        try {
            let response = await bookSession(sessionData);
            console.log('response from book session is ', response)
            alert('successfully updated booking');
        } catch(err) {
            console.log('An error occurred when booking session', err);
        }
    }

    return (
        <div style={{ margin: '0 5%' }}>
            <Typography variant="h2">Book Session</Typography>
            <TextLockup label="Date:" value={sessionData.date}/>
            <TextLockup label="Advisor:" value={sessionData.advisor}/>
            <TextLockup label="Time:" value={`${sessionData.startTime} - ${sessionData.endTime}`}/>
            <TextLockup label="Campus:" value={sessionData.room} />
            <TextLockup label="Type:" value={sessionData.type}/>
            <form onSubmit={handleSubmit}>
                <SessionBookingField id="studentId" title="Student ID" value={sessionData.studentId} handleChange={handleChange} />
                <SessionBookingField id="reason" title="This appointment is for..." value={sessionData.reason} handleChange={handleChange} />
                <SessionBookingField id="subjectName" title="Subject Name" value={sessionData.subjectName} handleChange={handleChange} />
                <SessionBookingField id="assignmentType" title="Assignment Type" value={sessionData.assignmentType} handleChange={handleChange} />
                <FormGroup>
                    <HelpOption id="bookingAnswer1" label="Answering the assignment question (please provide the question to your advisor)" handleCheckboxChange={handleCheckboxChange}/>
                    <HelpOption id="bookingAnswer2" label="Addressing the marking criteria (please provide the criteria to your advisor)" handleCheckboxChange={handleCheckboxChange}/>
                    <HelpOption id="bookingAnswer3" label="Structure" handleCheckboxChange={handleCheckboxChange}/>
                    <HelpOption id="bookingAnswer4" label="Paragraph development" handleCheckboxChange={handleCheckboxChange}/>
                    <HelpOption id="bookingAnswer5" label="Referencing" handleCheckboxChange={handleCheckboxChange}/>
                    <HelpOption id="bookingAnswer6" label="Grammar" handleCheckboxChange={handleCheckboxChange}/>
                    <HelpOption id="bookingAnswer7" label="Other, please specify below" handleCheckboxChange={handleCheckboxChange}/>
                </FormGroup>
                <Button id="submitBooking" color="primary" size="large" type="submit">Book Session</Button>
            </form>
            <FormGroup>
                <HelpOption id="emailStudent" label="Send email to student" handleCheckboxChange={handleEmailCheckboxChange} />
                <HelpOption id="emailAdmin" label="Send email to lecturer" handleCheckboxChange={handleEmailCheckboxChange} />
                <HelpOption id="checkRule" label="Check rule" handleCheckboxChange={handleEmailCheckboxChange} />
            </FormGroup>
            <div>
                <Typography variant="body1">Rule</Typography>
                <Typography variant="body1">- A session must be booked/cancelled/put into the waiting list at least 24 hours before appointment</Typography>
                <Typography variant="body1">- A student can only be put into the waiting list for the max 3 sessions for the week</Typography>
                <Typography variant="body1">- Student cannot make appoitnments for 1 year after 2nd no-show</Typography>
                <Typography variant="body1">- Student can book for up to 1 session per week</Typography>
                <Typography variant="body1">- Student can book for up to 3 sessions in advance</Typography>
            </div>
        </div>
    );
}

export default withRouter(BookSessionContainer);