//
//  CreateJobView.swift
//  Trade Marketplace
//
//  Created by Matthew Larsen on 8/10/22.
//

import SwiftUI
// hello
struct CreateJobView: View {
    @Environment(\.dismiss) var dismiss
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
                  
                    // Details
                        Details()
                    //When
                        When()
                        
                    //Where
                        Where()
                
                        
                    //Add tags
                        Tags()
                        
                    //Publish
                        Publish()

                    }
                    
                    
                } .padding(.horizontal, 20)
                
            }
        }.padding(.bottom, 60)
        
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

struct SelectCategory: View {
    var body: some View {
       
        HStack{
            Text("Select a Category")
            Spacer()
            Text("Select")
                .font(.footnote)
                .foregroundColor(Color.gray)
            Image(systemName: "chevron.right")
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: 15, height: 15)
        }
        
    }
}

struct When: View {
    var body: some View {
        Text("When")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 10)
        HStack{
            Text("Default: ASAP")
                .font(.footnote)
                .foregroundColor(Color.gray)
            Spacer()
            Text("Select")
                .font(.footnote)
                .foregroundColor(Color.gray)
            Image(systemName: "calendar.badge.plus")
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: 40, height: 30)
        }
            Divider()
                .background(.black)
                .padding(0)
        
        
        Text("When do you need the job done")
            .font(.footnote)
            .foregroundColor(Color.gray)
        }
    }

struct Details: View {
    var body: some View {
        Text("Details")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 10)
        
        List {
            SelectCategory()
            SelectCategory()
            SelectCategory()
        }.frame(height: 140)
            .listStyle(.plain)
        Text("A short job name helps tradies and the like easily identify and respond to your job")
            .font(.footnote)
            .foregroundColor(Color.gray)
        }
    }


struct Description: View {
    var body: some View {
        Text("Details")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 10)
        }
    }

struct Where: View {
    @State var manualaddress = String()
    @State private var showLocation = false
    @State var showLocationModifier = "They will come to me."
    var options = ["I'll go to them.", "They will come to me."]
    
    var body: some View {
        VStack {
            Text("Where")
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, 10)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            HStack{
                VStack {
                    VStack (alignment: .center, spacing: 10){
                        Picker("Please Select an option", selection: $showLocationModifier) {
                            ForEach(options, id: \.self) {
                                Text($0)
                                   
                            }  .font(.subheadline)
                            
                        }
                        .pickerStyle(.segmented)
                        
                        if showLocationModifier == "They will come to me." {
                            Toggle("Use My Address?", isOn: $showLocation)
                            
                            
                            if showLocation {
                                VStack(spacing: 20){
                                    Text("Users Address")
                                        .foregroundColor(Color.green)
                                        .multilineTextAlignment(.leading)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    MapView()
                                }
                            } else {
                                TextField(
                                    "e.g Sink Install",
                                    text: $manualaddress)
                                Divider()
                                    .background(.black)
                                    .padding(0)
                            }
                        }
                    }
                }
            }
        }
    }
}


struct Tags: View {
    var body: some View {
        Text("Tags")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 10)
        }
    }

struct Publish: View {
    var body: some View {
        Text("publish")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 10)
        SubmitJob()
        }
    }
struct SubmitJob: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 25)
            .foregroundColor(Color("UploadAJobGreen"))
            .frame(width: 359, height: 56)
            .overlay(
                VStack(alignment: .center, spacing: 0){
                    HStack{
 //                       Image (systemName: "plus.app.fill")
 //                           .resizable()
//                            .frame(width: 19, height: 19, alignment: .center)
 //                           .foregroundColor(.white)
                      Text("Submit Job")
                          .font(.title)
                          .fontWeight(.semibold)
                         .foregroundColor(.white)

                    }}
                    .frame(width: 319, height: 30, alignment: .center))
        }
                    
    }


struct SubmitJob_Previews: PreviewProvider {
    static var previews: some View {
        SubmitJob()
    }
}






struct CreateJobView_Previews: PreviewProvider {
    @Binding fileprivate var showLocation: Bool
    static var previews: some View {
        CreateJobView()
    }
}
