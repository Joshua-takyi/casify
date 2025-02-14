import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfilePage from "./profile";
import { GetProfileInfo } from "./get-profileInfo";

export const ProfileTabs = () => {
	return (
		<Tabs defaultValue="personal information" className="">
			<TabsList>
				<TabsTrigger value="personal information">
					Personal information
				</TabsTrigger>
				<TabsTrigger value="update information">Update Information</TabsTrigger>
			</TabsList>
			<TabsContent value="personal information">
				<GetProfileInfo />
			</TabsContent>
			<TabsContent value="update information">
				<ProfilePage />
			</TabsContent>
		</Tabs>
	);
};
