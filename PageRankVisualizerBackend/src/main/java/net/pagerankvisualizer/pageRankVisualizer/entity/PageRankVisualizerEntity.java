package net.pagerankvisualizer.pageRankVisualizer.entity;
import java.time.LocalDateTime;
import java.util.*;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import net.pagerankvisualizer.pageRankVisualizer.structure.Edge;

@Document(collection = "page_entries")
public class PageRankVisualizerEntity {

    @Id
    private ObjectId id;
    private List<String> vertices;
    private List<Edge> edges;
    private Map<String,Double>ranks;
    private LocalDateTime date;

    public ObjectId getId(){
        return id;
    }

    public void setId(ObjectId id){
        this.id=id;
    }
    
    public List<String> getVertices(){
        return (vertices!=null)?vertices:new ArrayList<>();
    }
    
    public void setVertices(List<String> vertices){
        this.vertices=vertices;
    }

    public List<Edge> getEdges(){
        return (edges!=null)?edges:new ArrayList<>();
    }
    
    public void setEdges(List<Edge> edges){
        this.edges=edges;
    }

    public Map<String,Double> getRanks(){
        return ranks;
    }
    public void setRanks(Map<String,Double> ranks){
        this.ranks=ranks;
    }

    public LocalDateTime getDate(){
        return date;
    }

    public void setDate(LocalDateTime date){
        this.date=date;
    }
}