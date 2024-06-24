import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";

import { Box, Button } from "@mui/material";

import { supabase } from "../../supabaseClient";
import { useSnackbar } from "notistack";

type EditKey = keyof EditType;
type OrgKey = keyof Organization;

const editFields: EditKey[] = [
    "name",
    "url",
    "socials",
    "picture",
    "mission",
    "purpose",
    "benefit",
    "appointment_procedures",
    "uniqueness",
    "meeting_schedule",
    "meeting_days",
    "keywords",
    "tags",
    "commitment_level",
];

const OrgEditApproval = ({
    onBack,
    onApprove,
    onReject,
    ...edit
}: { onBack: () => void; onReject: () => void; onApprove: () => void } & EditType) => {
    const { enqueueSnackbar } = useSnackbar();

    /* fetch current org data to compare to */
    let [currentOrg, setCurrentOrg] = useState<Partial<Organization>>({});
    let [fields, setChangedFields] = useState<string[]>([]);

    useEffect(() => {
        /* find not null fields */
        let changedFields: string[] = [];
        for (let key of Object.keys(edit)) {
            let field: EditKey = key as EditKey;
            if (!editFields.includes(field)) continue;

            if (edit[field] !== null) {
                changedFields.push(key);
            }
        }

        let qs = changedFields.join(",\n");

        const fetchCurrentOrg = async () => {
            let { data, error } = await supabase
                .from("organizations")
                .select(qs)
                .eq("id", edit.organization_id);

            if (error || !data) {
                return enqueueSnackbar(
                    "Could not fetch current organization data. Please contact it@stuysu.org for support.",
                    { variant: "error" },
                );
            }

            setCurrentOrg(data[0] as Partial<Organization>);
            setChangedFields(changedFields);
        };

        fetchCurrentOrg();
    }, [edit]);

    const approve = async () => {
        let error;
        let updatedFields: any = {};

        for (let field of fields) {
            updatedFields[field] = edit[field as EditKey];
        }

        /* apply changes to organization */
        ({ error } = await supabase
            .from("organizations")
            .update(updatedFields)
            .eq("id", edit.organization_id));

        if (error) {
            return enqueueSnackbar(
                "Error updating organization. Contact it@stuysu.org for support.",
                { variant: "error" },
            );
        }

        /* delete organization edit */
        ({ error } = await supabase
            .from("organizationedits")
            .delete()
            .eq("id", edit.id));

        if (error) {
            return enqueueSnackbar(
                "Error deleting old organization edit. Please let it@stuysu.org know about this issue.",
                { variant: "error" },
            );
        }

        enqueueSnackbar("Organization edit approved!", { variant: "success" });
        onApprove();
    };

    const reject = async () => {
        let error;
        ({ error } = await supabase
            .from("organizationedits")
            .delete()
            .eq("id", edit.id));

        if (error) {
            return enqueueSnackbar(
                "Error deleting organization edit. Contact it@stuysu.org for support.",
                { variant: "error" },
            );
        }

        enqueueSnackbar("Organization edit rejected.", { variant: "success" });
        onReject();
    }

    return (
        <Box>
            <Button variant="contained" onClick={onBack}>
                Back
            </Button>
            <Button variant="contained" onClick={approve}>
                Approve
            </Button>
            <Button variant="contained" onClick={reject}>
                Reject
            </Button>
            <h1>{edit.organization_name}</h1>
            {fields.map((field, i) => {
                let f1: OrgKey = field as OrgKey;
                let f2: EditKey = field as EditKey;

                /* need to explicitly define this because interface Organization has non-string fields */
                let v1 = currentOrg[f1] as string;

                return (
                    <Box key={i}>
                        <b>{field}</b>: {v1 || "NONE"} {"->"} {`"${edit[f2]}"`}
                    </Box>
                );
            })}
        </Box>
    );
};

export default OrgEditApproval;
