//
//  UploadJobButton.swift
//  Trade Marketplace
//
//  Created by William larsen on 19/09/22.
//

import SwiftUI

struct UploadJobButton: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 25)
            .foregroundColor(Color("UploadAJobGreen"))
            .frame(width: 359, height: 56)
            .shadow(color: (Color("UploadAJobGreenGlow")), radius: 10, x: 0, y: 0)
            .overlay(
                VStack(alignment: .center, spacing: 0){
                NavigationLink(destination: ListjobView())
                    {HStack{
                        Image (systemName: "plus.app.fill")
                            .resizable()
                            .frame(width: 19, height: 19, alignment: .center)
                            .foregroundColor(.white)
                        Text("Upload a Job")
                            .foregroundColor(.white)
                            .font(.custom("Poppins-SemiBold", size: 24))
                    }}
                    .frame(width: 319, height: 30, alignment: .center)
                    
                    HStack{
                        Text("Recieve Quotes Instantly for Free")
                            .foregroundColor(.white)
                            .font(.custom("Poppins-SemiBold", size: 13))
                    }
                    .frame(width: 319, height: 21, alignment: .center)
        }
    )
    }
}

struct UploadJobButton_Previews: PreviewProvider {
    static var previews: some View {
        UploadJobButton()
    }
}
