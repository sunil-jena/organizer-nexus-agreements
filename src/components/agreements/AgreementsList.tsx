
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
import { Eye, FileText, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Agreement } from "@/types";

interface AgreementsListProps {
  agreements: Agreement[];
  onDelete?: (id: string) => void;
}

const AgreementsList: React.FC<AgreementsListProps> = ({ 
  agreements,
  onDelete 
}) => {
  const navigate = useNavigate();
  
  const handleView = (id: string) => {
    navigate(`/admin/agreements/${id}`);
  };

  const getBadgeVariant = (status: Agreement['status']) => {
    switch (status) {
      case "draft": return "secondary";
      case "pending": return "outline";
      case "active": return "default";
      case "expired": return "outline";
      case "terminated": return "destructive";
      default: return "outline";
    }
  };

  const getSignatureStatus = (agreement: Agreement) => {
    if (agreement.signedByAdmin && agreement.signedByOrganizer) {
      return <Badge variant="outline" className="bg-green-50">Fully Signed</Badge>;
    } else if (agreement.signedByAdmin) {
      return <Badge variant="outline" className="bg-yellow-50">Admin Signed</Badge>;
    } else if (agreement.signedByOrganizer) {
      return <Badge variant="outline" className="bg-yellow-50">Organizer Signed</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50">Unsigned</Badge>;
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Title</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Signatures</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agreements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No agreements found.
              </TableCell>
            </TableRow>
          ) : (
            agreements.map((agreement) => (
              <TableRow key={agreement.id}>
                <TableCell className="font-medium">{agreement.title}</TableCell>
                <TableCell>
                  {agreement.organizer?.orgName || "Unknown Organization"}
                </TableCell>
                <TableCell>
                  {new Date(agreement.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(agreement.status)}>
                    {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{getSignatureStatus(agreement)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleView(agreement.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {agreement.documentUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={agreement.documentUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    
                    {onDelete && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => onDelete && onDelete(agreement.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
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

export default AgreementsList;
