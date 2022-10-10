//
//  CreateJobView.swift
//  Trade Marketplace
//
//  Created by Matthew Larsen on 8/10/22.
//

import SwiftUI
// hello
struct CreateJobView: View {
    @State private var jobTitle = String()
    @State private var jobDesc: String = "Describe your job and anything else you think may be required." 
    var body: some View {
        VStack(alignment: .leading){
            HStack(spacing: 30){
                Image(systemName: "xmark")
                    .resizable()
                    .frame(width: 25, height: 25)
                    .scaledToFit()
                
                    
                Text("Create a job")
                    .font(.title)
                    .fontWeight(.bold)
                    
                    
            }.frame(width: 321, height: 24, alignment: .leading)
                .padding(.horizontal, 20)
        
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: 4, x: 0, y: 0)
                .opacity(0.5)
                .frame(height: 20, alignment: .bottom)
                
            
            ScrollView(.vertical){
                VStack(alignment: .leading, spacing: 10){
                    
                    
                    HStack{
                        ForEach (1..<5) { i in
                            UploadPictureIcon()
                        }
                        UploadCameraIcon()
                    }.padding(.vertical, 10)
                //Job Name
                    Text("Job name")
                        .font(.title)
                        .fontWeight(.bold)
                    VStack (alignment: .leading, spacing: 10){
                        TextField(
                        "e.g Sink Install",
                        text: $jobTitle)
                        Divider()
                            .background(.black)
                            .padding(0)
                        Text("A short job name helps tradies and the like easily identify and respond to your job")
                            .font(.footnote)
                            .foregroundColor(Color.gray)

                        
                    //Description
                        Text("Description")
                            .font(.title)
                            .fontWeight(.bold)
                            .padding(.top, 10)

                        
                        TextEditor(text: $jobDesc)
                            .foregroundColor(Color.black)
                            .frame(height: 200)
                            .overlay(Rectangle()
                                .stroke(Color.secondary).opacity(0.5))
                               
                            
   
                  
                        
                        Divider()
                            .background(.black)
                            .padding(0)
                            
                    // Details
                        Text("Details")
                            .font(.title)
                            .fontWeight(.bold)
                            .padding(.top, 10)
                        

                    }
                    
                    
                } .padding(.horizontal, 20)
            }
        
        }
        
    }
}

struct CreateJobView_Previews: PreviewProvider {
    static var previews: some View {
        CreateJobView()
    }
}


struct UploadPictureIcon: View {
    var body: some View {
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: 1, dash: [3]))
            .foregroundColor(.gray)
            .frame(width: 52, height: 52)
            .padding(5)
            .overlay(
                Image(systemName: "camera")
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: 22, height: 22)
                    
            )
        
    }
}


struct UploadCameraIcon: View {
    var body: some View {
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: 1, dash: [3]))
            .foregroundColor(.gray)
            .frame(width: 72, height: 52)
            .padding(5)
            .overlay(
                Image(systemName: "video.badge.plus")
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: 22, height: 22)
                    
            )
        
    }
}





