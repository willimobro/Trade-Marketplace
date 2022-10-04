//
//  LandscapeObject.swift
//  Trade Marketplace
//
//  Created by William larsen on 17/09/22.
//

import SwiftUI

struct LandscapeObject: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 11)
            .frame(width: 322, height: 85)
            .foregroundColor(.white)
            .shadow(color: Color("dropshadow25"), radius: 8, x: 0, y: 6)
            .overlay(
                HStack{
                    // left image
                    Image("money")
                        .resizable()
                        .frame(width: 60, height: 60)
                        .cornerRadius(6)
                    // category, title and pricing
                    VStack(spacing: 3){
                        Text("Category")
                            .font(.caption)
                            .fontWeight(.regular)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.leading)
                            .frame(width: 150, alignment: .leading)
                        Text("Job title")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.black)
                            .frame(width: 150, alignment: .leading)
                        Text("$00.00")
                            .font(.title3)
                            .fontWeight(.semibold)
                            .frame(width: 150, alignment: .leading)
                    }
                    .frame(width: 150, height: 60, alignment: .leading)
                    // time date and user
                    VStack{
                        Text("00.00.00")
                            .font(.caption)
                            .fontWeight(.thin)
                            .multilineTextAlignment(.leading)
                            .foregroundColor(.gray)
                        Spacer()
                    // username
                        Text("Mike Smith")
                            .font(.caption)
                            .fontWeight(.thin)
                            .multilineTextAlignment(.leading)
                    }
                    .frame(width: 62.0, height: 60.0, alignment: .topTrailing)
                }
                .frame(width: .infinity, height: .infinity)
            )
    }
        }
                        

                




struct LandscapeObject_Previews: PreviewProvider {
    static var previews: some View {
        LandscapeObject()
    }
}
