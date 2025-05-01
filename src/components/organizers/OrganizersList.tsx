
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Trash } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Organizer } from "@/types";

interface OrganizersListProps {
  organizers: Organizer[];
  onDelete?: (id: string) => void;
}

const OrganizersList: React.FC<OrganizersListProps> = ({ 
  organizers,
  onDelete
}) => {
  const navigate = useNavigate();
  
  const handleViewAgreements = (id: string) => {
    navigate(`/admin/organizers/${id}/agreements`);
  };
  
  const handleEdit = (id: string) => {
    navigate(`/admin/organizers/${id}/edit`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Organization</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>GST Number</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No organizers found.
              </TableCell>
            </TableRow>
          ) : (
            organizers.map((organizer) => (
              <TableRow key={organizer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={organizer.orgLogo} />
                      <AvatarFallback>{getInitials(organizer.orgName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{organizer.orgName}</p>
                      {organizer.gstDetails.isRegistered && (
                        <Badge variant="outline" className="mt-1">
                          GST Registered
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {organizer.address}
                </TableCell>
                <TableCell>
                  {organizer.gstDetails.isRegistered 
                    ? organizer.gstDetails.gstNumber 
                    : "Not registered"}
                </TableCell>
                <TableCell>
                  {new Date(organizer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleViewAgreements(organizer.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEdit(organizer.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {onDelete && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Organizer</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete {organizer.orgName}? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => onDelete(organizer.id)}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrganizersList;
