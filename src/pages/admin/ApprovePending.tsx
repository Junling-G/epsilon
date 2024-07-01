import { useEffect, useState, useContext } from "react";
import { supabase } from "../../supabaseClient";
import { Box, Button, Card, Typography } from "@mui/material";

import OrgApproval from "../../comps/admin/OrgApproval";
import { useSnackbar } from "notistack";
import PendingOrgCard from "../../comps/admin/PendingOrgCard";

const ApprovePending = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [pendingOrgs, setPendingOrgs] = useState<Partial<OrgContextType>[]>(
        [],
    );

    const [view, setView] = useState<Partial<OrgContextType>>();

    useEffect(() => {
        const fetchPendingOrgs = async () => {
            const { error, data } = await supabase
                .from("organizations")
                .select(
                    `
                    id,
                    name,
                    url,
                    picture,
                    mission,
                    purpose,
                    benefit,
                    appointment_procedures,
                    uniqueness,
                    meeting_schedule,
                    meeting_days,
                    keywords,
                    tags,
                    commitment_level,
                    state,
                    joinable,
                    join_instructions,
                    memberships (
                        id,
                        role,
                        role_name,
                        active,
                        users (
                            id,
                            first_name,
                            last_name,
                            email,
                            picture,
                            is_faculty
                        )
                    )
                `,
                )
                .eq("state", "PENDING");

            if (error || !data) {
                return enqueueSnackbar(
                    "Failed to fetch pending organizations. Contact it@stuysu.org for support.",
                    { variant: "error" },
                );
            }

            setPendingOrgs(data as Partial<OrgContextType>[]);
        };

        fetchPendingOrgs();
    }, []);

    if (view) {
        return (
            <OrgApproval
                {...view}
                onBack={() => setView(undefined)}
                onDecision={() => {
                    // remove self from pending orgs
                    setPendingOrgs(pendingOrgs.filter((o) => o.id !== view.id));
                    setView(undefined);
                }}
            />
        );
    }

    return (
        <Box>
            <Typography variant="h1" align="center">Org Approvals</Typography>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap", padding: "10px" }}>
                {pendingOrgs.map((org, i) => (
                    <Box key={i} sx={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "10px"}}>
                        <PendingOrgCard 
                            name={org.name}
                            picture={org.picture || ""}
                            onView={() => setView(org)}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ApprovePending;
