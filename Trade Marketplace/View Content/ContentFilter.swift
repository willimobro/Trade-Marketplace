//
//  Filter.swift
//  Trade Marketplace
//
//  Created by William larsen on 20/09/22.
//

import SwiftUI

struct Filter: View {
    @State var true1: Bool = true
    @State var true2: Bool = true
    @State var true3: Bool = true
    @State var true4: Bool = true
    @State var true5: Bool = true
    @State var true6: Bool = true
    
    var body: some View {
        Rectangle()
            .frame(width: .infinity, height: 597)
            .cornerRadius(30)
            .shadow(color: .gray, radius: 4, x: 0, y: 0)
            .foregroundColor(.white)
            .overlay(VStack{
                HStack(spacing: 20){
                    Button{
                        print("hello")
                    } label:{
                    Image(systemName: "xmark")
                        .resizable()
                        .frame(width: 21, height: 21)
                        .accentColor(.black)
                    }
                    Text("Filter")
                        .font(.custom("Poppins-SemiBold", size: 28))
                    Spacer()
                    Button{
                        print("hello")
                    } label:{
                        Text("Reset")
                            .font(.subheadline)
                            .accentColor(.gray)
                    }
                    
                }.frame(width: 321, height: 39, alignment: .leading)
                    .padding(.horizontal, 27)
                Divider()
                    .background(.black)
                List(){
                    HStack{
                        Text("Subcatergory")
                        Spacer()
                        Toggle(isOn: $true1){
                            
                        }
                        
                    }
                    .listSectionSeparator(.hidden)
                    HStack{
                        Text("Subcatergory")
                        Spacer()
                        Toggle(isOn: $true2){
                            
                        }
                        
                    }
                    HStack{
                        Text("Subcatergory")
                        Spacer()
                        Toggle(isOn: $true3){
                            
                        }
                        
                    }
                    HStack{
                        Text("Subcatergory")
                        Spacer()
                        Toggle(isOn: $true4){
                            
                        }
                        
                    }
                    HStack{
                        Text("Subcatergory")
                        Spacer()
                        Toggle(isOn: $true5){
                            
                        }
                        
                    }
                    HStack{
                        Text("Subcatergory")
                        Spacer()
                        Toggle(isOn: $true6){
                            
                        }
                        
                    }
                    
                }
                .listStyle(.plain)
            }
                .frame(height: 537, alignment: .top))
    }
}

struct Filter_Previews: PreviewProvider {
    static var previews: some View {
        Filter()
    }
}
