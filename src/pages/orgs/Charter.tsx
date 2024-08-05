import { useContext } from "react";
import OrgContext from "../../comps/context/OrgContext";
import { Box, Typography } from "@mui/material";

const formatDays = (meeting_days: string[]) => {
    return meeting_days
        .map((m) => m.slice(0, 1).toUpperCase() + m.slice(1).toLowerCase())
        .join(", ");
};

const Charter = () => {
    const organization: OrgContextType = useContext(OrgContext);

    return (
        <Box>
            <Typography variant="h1" align="center" width="100%">
                Charter
            </Typography>
            <Typography variant="h3" color="primary.main">
                Mission Statement:
            </Typography>
            <Typography>{organization.mission || "None"}</Typography>
            <Typography variant="h3" color="primary.main">
                What days does this organization meet?
            </Typography>
            <Typography>
                {formatDays(organization.meeting_days || []) || "None"}
            </Typography>
            <Typography variant="h3" color="primary.main">
                What is the meeting schedule?
            </Typography>
            <Typography>{organization.meeting_schedule || "None"}</Typography>
            <Typography variant="h3" color="primary.main">
                GOALS
            </Typography>
            <Typography>{organization.goals || "None"}</Typography>
            <Typography variant="h3" color="primary.main">
                MEETING DESCRIPTION
            </Typography>
            <Typography>
                {organization.meeting_description || "None"}
            </Typography>
            <Typography variant="h3" color="primary.main">
                CLUB DESCRIPTION
            </Typography>
            <Typography>{organization.purpose || "None"}</Typography>
            <Typography variant="h3" color="primary.main">
                How does this activity appoint leaders?
            </Typography>
            <Typography>
                {organization.appointment_procedures || "None"}
            </Typography>
            <Typography variant="h3" color="primary.main">
                What makes this activity unique?
            </Typography>
            <Typography>{organization.uniqueness || "None"}</Typography>
        </Box>
    );
};

export default Charter;
