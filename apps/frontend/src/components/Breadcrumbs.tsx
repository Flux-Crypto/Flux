import { Anchor, Breadcrumbs as BreadcrumbsComponent } from "@mantine/core";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Breadcrumbs = () => {
    const router = useRouter();
    const [links, setLinks] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const paths = router.pathname.split("/");
        let href = paths[0];
        const linkItems = _.range(1, paths.length).map((index) => {
            href += `/${paths[index]}`;
            return (
                <Anchor href={href} key={paths[index]}>
                    {_.startCase(paths[index])}
                </Anchor>
            );
        });
        setLinks(linkItems);
    }, [router.pathname]);

    return <BreadcrumbsComponent>{links}</BreadcrumbsComponent>;
};

export default Breadcrumbs;
