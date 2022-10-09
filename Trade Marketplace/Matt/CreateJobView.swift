//
//  CreateJobView.swift
//  Trade Marketplace
//
//  Created by Matthew Larsen on 8/10/22.
//

import SwiftUI

struct CreateJobView: View {
    @State private var jobTitle = String()
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
                    
                    Text("Job name")
                        .font(.title)
                        .fontWeight(.bold)
                    VStack {
                        TextField(
                        "e.g Sink Install",
                        text: $jobTitle)
                        Divider()
                            .background(.black)
                            .padding(0)
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
